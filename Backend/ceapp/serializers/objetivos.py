from rest_framework import serializers
from ..models import Objetivo

class ObjetivoLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = ["id", "titulo", "categoria"]

class ObjetivoReadSerializer(serializers.ModelSerializer):
    autor_creacion = serializers.CharField(source="autor_creacion.get_full_name", read_only=True)
    autor_modificacion = serializers.CharField(source="autor_modificacion.get_full_name", read_only=True)
    plan_trabajo = serializers.CharField(source="plan_trabajo.nombre", read_only=True)
    fecha_creacion = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)
    fecha_modificacion = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)

    class Meta:
        model = Objetivo
        fields = "__all__"
        read_only_fields = [
            "autor_creacion",
            "fecha_creacion",
            "autor_modificacion",
            "fecha_modificacion",
            "plan_trabajo",
        ]

class ObjetivoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Objetivo
        fields = "__all__"
        read_only_fields = ["autor_creacion", "fecha_creacion", "autor_modificacion", "fecha_modificacion"]
