from django.db import transaction
from rest_framework import serializers
from ..models import BitacoraEntrada, BitacoraEntradaObjetivo, Objetivo
from .objetivos import ObjetivoLiteSerializer

class BitacoraEntradaReadSerializer(serializers.ModelSerializer):
    autor = serializers.CharField(source="autor.get_full_name", read_only=True)
    objetivos = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BitacoraEntrada
        fields = ["id", "fecha", "titulo", "comentarios", "plan_trabajo", "autor", "objetivos"]

    def get_objetivos(self, obj):
        # evita N+1 con prefetch en la view
        rels = obj.objetivos_relacionados.select_related("objetivo")
        objetivos = [rel.objetivo for rel in rels]
        return ObjetivoLiteSerializer(objetivos, many=True).data


class BitacoraEntradaWriteSerializer(serializers.ModelSerializer):
    # IDs de objetivos a vincular en la tabla through
    objetivos_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True,
        required=False,
        allow_empty=True,
    )

    class Meta:
        model = BitacoraEntrada
        fields = ["id", "fecha", "titulo", "comentarios", "plan_trabajo", "objetivos_ids"]

    def validate_objetivos_ids(self, value):
        if not value:
            return []
        existentes = set(Objetivo.objects.filter(id__in=value).values_list("id", flat=True))
        faltantes = [oid for oid in value if oid not in existentes]
        if faltantes:
            raise serializers.ValidationError(f"Objetivo(s) no encontrado(s): {faltantes}")
        return value

    @transaction.atomic
    def create(self, validated_data):
        objetivos_ids = validated_data.pop("objetivos_ids", [])
        bitacora = BitacoraEntrada.objects.create(**validated_data)

        if objetivos_ids:
            BitacoraEntradaObjetivo.objects.bulk_create([
                BitacoraEntradaObjetivo(bitacora_entrada=bitacora, objetivo_id=oid)
                for oid in objetivos_ids
            ])

        return bitacora
