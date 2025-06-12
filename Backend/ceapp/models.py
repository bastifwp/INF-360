from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('cuidador', 'Cuidador'),
        ('profesional', 'Profesional'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    cargo = models.CharField(max_length=100, null=True, blank=True)
    institucion = models.CharField(max_length=100, null=True, blank=True)


class PlanTrabajo(models.Model):
    nombre = models.CharField(max_length=255)
    cuidador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planes_cuidador')

    def __str__(self):
        return self.nombre


class ProfesionalPlanTrabajo(models.Model):
    profesional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planes_profesional')
    plan_trabajo = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name='profesionales')


class Objetivo(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    autor_creacion = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='objetivos_creados')
    fecha_modificacion = models.DateTimeField(auto_now=True)
    autor_modificacion = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='objetivos_modificados')
    plan_trabajo = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name='objetivos')

    def __str__(self):
        return self.titulo


class BitacoraEntrada(models.Model):
    plan_trabajo = models.ForeignKey(PlanTrabajo, on_delete=models.CASCADE, related_name='bitacoras')
    fecha = models.DateField()
    titulo = models.CharField(max_length=255)
    comentarios = models.TextField()
    autor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='bitacoras_creadas')

    def __str__(self):
        return self.titulo


class BitacoraEntradaObjetivo(models.Model):
    bitacora_entrada = models.ForeignKey(BitacoraEntrada, on_delete=models.CASCADE, related_name='objetivos_relacionados')
    objetivo = models.ForeignKey(Objetivo, on_delete=models.CASCADE, related_name='bitacoras_relacionadas')