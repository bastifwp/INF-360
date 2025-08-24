from rest_framework import serializers
from ..models import Mensaje, ProfesionalPlanTrabajo

class MensajeSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="autor.username")

    class Meta:
        model = Mensaje
        fields = ['id', 'user', 'text', 'timestamp']



class UltimaLecturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfesionalPlanTrabajo
        fields = ['ultima_lectura']