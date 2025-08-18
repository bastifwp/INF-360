from rest_framework import serializers
from ..models import ProfesionalPlanTrabajo, BitacoraEntradaObjetivo

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

class BitacoraEntradaObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraEntradaObjetivo
        fields = "__all__"
