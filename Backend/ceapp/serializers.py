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
        nombre = validated_data.pop('nombre')
        password = validated_data.pop('password')

        user = CustomUser(**validated_data)
        user.first_name = nombre
        user.set_password(password)
        user.username = validated_data['email']
        user.save()
        return user
    
# Esqueletos de serializers para pruebas
    
class PlanTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanTrabajo
        fields = '__all__'

class ObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = '__all__'
        read_only_fields = ['autor_creacion', 'fecha_creacion', 'autor_modificacion', 'fecha_modificacion']

class BitacoraEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraEntrada
        fields = '__all__'

class ProfesionalPlanTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfesionalPlanTrabajo
        fields = '__all__'

class BitacoraEntradaObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraEntradaObjetivo
        fields = '__all__'