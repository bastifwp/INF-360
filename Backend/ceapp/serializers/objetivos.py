# ceapp/serializers/objetivos.py
from rest_framework import serializers
from ..models import ObjetivoGeneral, ObjetivoEspecifico

# -------------------------------
# Objetivo ESPECÍFICO
# -------------------------------
class ObjetivoEspecificoLiteSerializer(serializers.ModelSerializer):
    categoria = serializers.SerializerMethodField()
    clasificacion = serializers.IntegerField(read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = ObjetivoEspecifico
        fields = ["id", "titulo", "estado", "estado_display", "categoria", "clasificacion"]

    def get_categoria(self, obj):
        gen = obj.objetivo_general
        if not gen:
            return None
        # Si usas FK CategoriaObjetivo con atributo 'nombre'
        if hasattr(gen, "categoria") and gen.categoria is not None:
            return getattr(gen.categoria, "nombre", str(gen.categoria))
        # Si usas CharField:
        return getattr(gen, "categoria", None)


class ObjetivoEspecificoReadSerializer(serializers.ModelSerializer):
    autor_creacion = serializers.CharField(source="autor_creacion.get_full_name", read_only=True)
    autor_modificacion = serializers.CharField(source="autor_modificacion.get_full_name", read_only=True)
    plan_trabajo = serializers.CharField(source="objetivo_general.plan_trabajo.nombre", read_only=True)
    fecha_creacion = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)
    fecha_modificacion = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)
    clasificacion = serializers.IntegerField(read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)

    class Meta:
        model = ObjetivoEspecifico
        fields = "__all__"
        read_only_fields = [
            "autor_creacion",
            "fecha_creacion",
            "autor_modificacion",
            "fecha_modificacion",
            "plan_trabajo",
            "clasificacion",
            "estado_display",
        ]


class ObjetivoEspecificoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObjetivoEspecifico
        fields = "__all__"
        read_only_fields = ["autor_creacion", "fecha_creacion", "autor_modificacion", "fecha_modificacion"]


# -------------------------------
# Objetivo GENERAL
# -------------------------------
class ObjetivoGeneralLiteSerializer(serializers.ModelSerializer):
    clasificacion = serializers.IntegerField(read_only=True)

    class Meta:
        model = ObjetivoGeneral
        fields = ["id", "titulo", "categoria", "clasificacion"]


class ObjetivoGeneralReadSerializer(serializers.ModelSerializer):
    autor_creacion = serializers.CharField(source="autor_creacion.get_full_name", read_only=True)
    autor_modificacion = serializers.CharField(source="autor_modificacion.get_full_name", read_only=True)
    plan_trabajo = serializers.CharField(source="plan_trabajo.nombre", read_only=True)
    fecha_creacion = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)
    fecha_modificacion = serializers.DateTimeField(format="%d/%m/%Y", read_only=True)
    clasificacion = serializers.IntegerField(read_only=True)

    # Si usas FK a CategoriaObjetivo y quieres devolver su nombre
    categoria_nombre = serializers.SerializerMethodField()

    class Meta:
        model = ObjetivoGeneral
        fields = [
            "id", "plan_trabajo", "titulo", "descripcion", "categoria",
            "categoria_nombre", "fecha_creacion", "autor_creacion",
            "fecha_modificacion", "autor_modificacion", "clasificacion",
        ]
        read_only_fields = [
            "autor_creacion",
            "fecha_creacion",
            "autor_modificacion",
            "fecha_modificacion",
            "plan_trabajo",
            "clasificacion",
            "categoria_nombre",
        ]

    def get_categoria_nombre(self, obj):
        # si 'categoria' es CharField, devolvemos el string tal cual
        if isinstance(getattr(obj, "categoria", None), str) or obj.categoria is None:
            return obj.categoria
        # si es FK, devolvemos el nombre (o __str__)
        return getattr(obj.categoria, "nombre", str(obj.categoria))


class ObjetivoGeneralWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObjetivoGeneral
        fields = "__all__"
        read_only_fields = ["autor_creacion", "fecha_creacion", "autor_modificacion", "fecha_modificacion"]
