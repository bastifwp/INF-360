from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extiende el payload del token con campos mínimos que requiere el frontend.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = (self.user.role or "").lower()
        data["nombre"] = self.user.first_name or ""
        return data


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    nombre = serializers.CharField(write_only=True, required=True)  # mapea a first_name

    class Meta:
        model = User
        fields = ["email", "password", "nombre", "role", "cargo", "institucion"]

    def validate_email(self, value):
        email = value.strip().lower()
        # username = email (tu código ya seguía esta convención)
        if User.objects.filter(username=email).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return email

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        email = validated_data.pop("email").lower().strip()
        password = validated_data.pop("password")
        nombre = validated_data.pop("nombre").strip()
        role = validated_data.pop("role", None)
        cargo = validated_data.pop("cargo", None)
        institucion = validated_data.pop("institucion", None)

        # usa create_user si tu manager lo soporta
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=nombre,
            role=role,
            cargo=cargo,
            institucion=institucion,
            **validated_data,
        )
        return user
