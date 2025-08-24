from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


# ---------------------------
# Usuario
# ---------------------------
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('cuidador', 'Cuidador'),
        ('profesional', 'Profesional'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    cargo = models.CharField(max_length=100, null=True, blank=True)
    institucion = models.CharField(max_length=100, null=True, blank=True)


# ---------------------------
# Plan de trabajo y chat
# ---------------------------
class PlanTrabajo(models.Model):
    nombre = models.CharField(max_length=255)
    cuidador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planes_cuidador')

    def __str__(self):
        return self.nombre


class ProfesionalPlanTrabajo(models.Model):
    profesional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planes_profesional')
    plan_trabajo = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name='profesionales')

    class Meta:
        unique_together = ('profesional', 'plan_trabajo')  # evita duplicados


class Mensaje(models.Model):
    plan = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name="mensajes")
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    contenido = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


# ---------------------------
# Objetivos
# ---------------------------

class CategoriaObjetivo(models.Model):
    """Opcional (sirve para la HDU16). Puedes omitirla y dejar 'categoria' como CharField."""
    nombre = models.CharField(max_length=80, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class ObjetivoGeneral(models.Model):
    """
    Equivale a tu interfaz TS 'ObjetivoGeneral' del doc:
    - id: number (por defecto en Django)
    - titulo, descripcion, categoria, fechas y autores
    La 'clasificación' se calcula en backend (propiedad).
    """
    plan_trabajo = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name='objetivos_generales')

    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(max_length=4000)
    # Si prefieres sin tabla de categorías, reemplaza por: categoria = models.CharField(max_length=100, null=True, blank=True)
    categoria = models.ForeignKey(CategoriaObjetivo, on_delete=models.SET_NULL, null=True, blank=True)

    # auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    autor_creacion = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='objgen_creados')
    fecha_modificacion = models.DateTimeField(auto_now=True)
    autor_modificacion = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='objgen_modificados')

    class Meta:
        ordering = ['-fecha_modificacion', '-fecha_creacion']

    def __str__(self):
        return self.titulo

    # --- Clasificación: 0 Nuevo, 1 Activo, 2 Inactivo ---
    @property
    def clasificacion(self) -> int:
        """
        0 = Nuevo (sin objetivos específicos)
        1 = Activo (tiene al menos 1 objetivo específico con >=1 profesional vinculado)
        2 = Inactivo (tiene objetivos específicos pero ninguno con profesionales vinculados)
        """
        total_especificos = self.objetivos_especificos.count()
        if total_especificos == 0:
            return 0
        # ¿alguno activo?
        return 1 if self.objetivos_especificos.filter(vinculaciones__isnull=False).exists() else 2


class ObjetivoEspecifico(models.Model):
    """
    Equivale a tu interfaz TS 'ObjetivoEspecifico'.
    'estado' (HDU6) admite NL/ML/L. Usa constantes para no confundirse con el orden.
    """
    class Estado(models.IntegerChoices):
        NO_LOGRADO = 0, 'No logrado (NL)'
        MEDIANAMENTE_LOGRADO = 1, 'Medianamente logrado (ML)'
        LOGRADO = 2, 'Logrado (L)'

    objetivo_general = models.ForeignKey(ObjetivoGeneral, on_delete=models.CASCADE, related_name='objetivos_especificos')

    titulo = models.CharField(max_length=255)
    estado = models.IntegerField(choices=Estado.choices, default=Estado.NO_LOGRADO)
    descripcion = models.TextField(max_length=4000, blank=True, null=True)

    # auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    autor_creacion = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='objspe_creados')
    fecha_modificacion = models.DateTimeField(auto_now=True)
    autor_modificacion = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='objspe_modificados')

    # profesionales vinculados (a través de modelo intermedio para auditar)
    profesionales = models.ManyToManyField(
        User,
        through='VinculacionObjetivoEspecifico',
        related_name='objetivos_especificos_vinculados'
    )

    class Meta:
        ordering = ['-fecha_modificacion', '-fecha_creacion']

    def __str__(self):
        return self.titulo

    # --- Clasificación: 1 Activo, 2 Inactivo ---
    @property
    def clasificacion(self) -> int:
        return 1 if self.vinculaciones.exists() else 2


class VinculacionObjetivoEspecifico(models.Model):
    """Vinculación de un profesional a un objetivo específico (HDU6)."""
    objetivo_especifico = models.ForeignKey(ObjetivoEspecifico, on_delete=models.CASCADE, related_name='vinculaciones')
    profesional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vinculaciones_objetivos')
    fecha_vinculacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('objetivo_especifico', 'profesional')  # un único enlace


# ---------------------------
# Bitácora (HDU3) — ahora apunta a ObjetivoEspecifico
# ---------------------------
class BitacoraEntrada(models.Model):
    plan_trabajo = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name='bitacoras')
    fecha = models.DateField()
    titulo = models.CharField(max_length=255)
    comentarios = models.TextField(blank=True, null=True)
    autor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='bitacoras_creadas')

    # objetivos específicos trabajados en la sesión
    objetivos_especificos = models.ManyToManyField(ObjetivoEspecifico, through='BitacoraEntradaObjetivo')

    def __str__(self):
        return self.titulo


class BitacoraEntradaObjetivo(models.Model):
    bitacora_entrada = models.ForeignKey(
        BitacoraEntrada, on_delete=models.CASCADE, related_name='objetivos_relacionados'
    )
    # 👇 permitir nulos para migrar sin datos previos
    objetivo_especifico = models.ForeignKey(
        ObjetivoEspecifico, on_delete=models.CASCADE, related_name='bitacoras_relacionadas',
        null=True, blank=True
    )