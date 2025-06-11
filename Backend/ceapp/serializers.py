from rest_framework import serializers
from .models import CustomUser, PlanTrabajo, ProfesionalPlanTrabajo, Objetivo, BitacoraEntrada, BitacoraEntradaObjetivo

class RegisterSerializer(serializers.ModelSerializer):
    # campos adicionales personalizados
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    nombre = serializers.CharField(write_only=True, required=True)  # lo mapeamos a first_name

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'nombre', 'role', 'cargo', 'institucion']

    def create(self, validated_data):
        nombre = validated_data.pop('nombre')  # sacamos nombre
        password = validated_data.pop('password')

        user = CustomUser(**validated_data)
        user.first_name = nombre
        user.set_password(password)
        user.username = validated_data['email']  # opcional: username = email
        user.save()
        return user