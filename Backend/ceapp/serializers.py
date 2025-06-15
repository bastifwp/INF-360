from rest_framework import serializers
from .models import CustomUser, PlanTrabajo, ProfesionalPlanTrabajo, Objetivo, BitacoraEntrada, BitacoraEntradaObjetivo


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


#Extendemos la clase de serializer para que retorne más cosas que nececita el frontend
class  CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        #Agregamos campos a la response
        data['role'] = self.user.role.lower()
        data['nombre'] = self.user.first_name

        return data



class RegisterSerializer(serializers.ModelSerializer):
    # campos adicionales personalizados
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    nombre = serializers.CharField(write_only=True, required=True)  # lo mapeamos a first_name

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'nombre', 'role', 'cargo', 'institucion']

    #Funciones de validación que se llaman automáticamente cuando se ocupe .is_valid en las views
    def validate_email(self, value):

        #Buscamos el correo en la base de datos
        print(CustomUser.objects.all())
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        
        #Si todo está bien entonces el dato es válido
        return value


    def create(self, validated_data):

        #Obtenemos los datos del json
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        nombre = validated_data.pop('nombre')
        role = validated_data.pop('role')
        cargo = validated_data.pop('cargo', None)             #None porque puede ser vacío
        institucion = validated_data.pop('institucion', None) #None porque puede ser vacío

        #Creamos al usuairo
        user = CustomUser(**validated_data)
        user.first_name = nombre
        user.set_password(password)
        user.username = email
        user.role = role
        user.cargo = cargo
        user.institucion = institucion
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

class ObjetivoLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = ['id', 'titulo', 'categoria']


class BitacoraEntradaSerializer(serializers.ModelSerializer):
    objetivos = serializers.SerializerMethodField(read_only=True)
    selected_obj = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = BitacoraEntrada
        fields = ['id', 'fecha', 'titulo', 'comentarios', 'plan_trabajo', 'autor', 'objetivos', 'selected_obj']

    def get_objetivos(self, obj):
        objetivos_relacionados = obj.objetivos_relacionados.select_related('objetivo')
        objetivos = [rel.objetivo for rel in objetivos_relacionados]
        return ObjetivoLiteSerializer(objetivos, many=True).data

    def create(self, validated_data):
        selected_obj = validated_data.pop('selected_obj', [])
        bitacora = BitacoraEntrada.objects.create(**validated_data)

        for obj_id in selected_obj:
            try:
                objetivo = Objetivo.objects.get(id=obj_id)
                BitacoraEntradaObjetivo.objects.create(bitacora_entrada=bitacora, objetivo=objetivo)
            except Objetivo.DoesNotExist:
                continue

        return bitacora
class ProfesionalPlanTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfesionalPlanTrabajo
        fields = '__all__'

class BitacoraEntradaObjetivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraEntradaObjetivo
        fields = '__all__'