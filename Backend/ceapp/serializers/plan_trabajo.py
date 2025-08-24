from rest_framework import serializers
from ..models import PlanTrabajo

class PlanTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanTrabajo
        fields = "__all__"
