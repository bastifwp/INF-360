# serializers/relaciones.py
from rest_framework import serializers
from ..models import ProfesionalPlanTrabajo, BitacoraEntradaObjetivo, ObjetivoEspecifico

class ProfesionalPlanTrabajoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="plan_trabajo.id", read_only=True)
    nombre = serializers.CharField(source="plan_trabajo.nombre", read_only=True)
    cuidador = serializers.SerializerMethodField()

    class Meta:
        model = ProfesionalPlanTrabajo
        fields = ["id", "nombre", "cuidador"]

    def get_cuidador(self, obj):
        cuidador = getattr(obj.plan_trabajo, "cuidador", None)
        if not cuidador:
            return None
        full = f"{cuidador.first_name} {cuidador.last_name}".strip()
        return full or getattr(cuidador, "username", None)


# -------- Bitácora <-> ObjetivoEspecífico --------

class BitacoraEntradaObjetivoWriteSerializer(serializers.ModelSerializer):
    """
    Serializer para crear/editar relaciones. Valida que el objetivo específico
    pertenezca al mismo plan de la bitácora.
    """
    class Meta:
        model = BitacoraEntradaObjetivo
        fields = ["id", "bitacora_entrada", "objetivo_especifico"]

    def validate(self, attrs):
        bitacora = attrs.get("bitacora_entrada") or getattr(self.instance, "bitacora_entrada", None)
        objetivo_especifico = attrs.get("objetivo_especifico") or getattr(self.instance, "objetivo_especifico", None)

        if bitacora and objetivo_especifico:
            plan_bitacora = bitacora.plan_trabajo_id
            plan_obj = objetivo_especifico.objetivo_general.plan_trabajo_id
            if plan_bitacora != plan_obj:
                raise serializers.ValidationError(
                    "El objetivo específico no pertenece al mismo plan de la bitácora."
                )
        return attrs


class BitacoraEntradaObjetivoReadSerializer(serializers.ModelSerializer):
    """
    Serializer de lectura con datos útiles del objetivo específico.
    """
    objetivo_id = serializers.IntegerField(source="objetivo_especifico.id", read_only=True)
    objetivo_titulo = serializers.CharField(source="objetivo_especifico.titulo", read_only=True)
    objetivo_estado = serializers.CharField(source="objetivo_especifico.get_estado_display", read_only=True)
    categoria = serializers.SerializerMethodField()

    class Meta:
        model = BitacoraEntradaObjetivo
        fields = ["id", "bitacora_entrada", "objetivo_especifico", "objetivo_id",
                  "objetivo_titulo", "objetivo_estado", "categoria"]

    def get_categoria(self, obj):
        gen = getattr(obj.objetivo_especifico, "objetivo_general", None)
        if not gen:
            return None
        # Si ObjetivoGeneral.categoria es FK con 'nombre'
        if hasattr(gen, "categoria") and gen.categoria is not None:
            return getattr(gen.categoria, "nombre", str(gen.categoria))
        # Si es CharField:
        return getattr(gen, "categoria", None)


# Mantén este alias si en otros lados importas este nombre antiguo:
BitacoraEntradaObjetivoSerializer = BitacoraEntradaObjetivoReadSerializer
