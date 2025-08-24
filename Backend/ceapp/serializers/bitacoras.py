# ceapp/serializers/bitacoras.py
from django.db import transaction
from rest_framework import serializers

from ..models import (
    BitacoraEntrada,
    BitacoraEntradaObjetivo,
    ObjetivoEspecifico,
)
# IMPORTA DESDE EL ARCHIVO CONCRETO, NO DESDE ..serializers
from .objetivos import ObjetivoEspecificoLiteSerializer


class BitacoraEntradaReadSerializer(serializers.ModelSerializer):
    autor = serializers.CharField(source="autor.get_full_name", read_only=True)
    objetivos = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BitacoraEntrada
        fields = ["id", "fecha", "titulo", "comentarios", "plan_trabajo", "autor", "objetivos"]

    def get_objetivos(self, obj):
        rels = obj.objetivos_relacionados.select_related(
            "objetivo_especifico",
            "objetivo_especifico__objetivo_general",
            "objetivo_especifico__objetivo_general__categoria",
        )
        objetivos = [rel.objetivo_especifico for rel in rels]
        return ObjetivoEspecificoLiteSerializer(objetivos, many=True).data


class BitacoraEntradaWriteSerializer(serializers.ModelSerializer):
    # IDs de ObjetivoEspecifico a vincular
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
        existentes = set(
            ObjetivoEspecifico.objects.filter(id__in=value).values_list("id", flat=True)
        )
        faltantes = [oid for oid in value if oid not in existentes]
        if faltantes:
            raise serializers.ValidationError(f"Objetivo(s) específico(s) no encontrado(s): {faltantes}")
        return value

    def validate(self, attrs):
        # todos los objetivos específicos deben pertenecer al mismo plan que la bitácora
        objetivos_ids = attrs.get("objetivos_ids") or []
        plan = attrs.get("plan_trabajo")
        if objetivos_ids and plan:
            plans = set(
                ObjetivoEspecifico.objects.filter(id__in=objetivos_ids)
                .values_list("objetivo_general__plan_trabajo_id", flat=True)
            )
            if len(plans) > 1 or (plans and plan.id not in plans):
                raise serializers.ValidationError(
                    "Todos los objetivos específicos deben pertenecer al mismo plan de trabajo."
                )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        objetivos_ids = validated_data.pop("objetivos_ids", [])
        bitacora = BitacoraEntrada.objects.create(**validated_data)
        if objetivos_ids:
            BitacoraEntradaObjetivo.objects.bulk_create([
                BitacoraEntradaObjetivo(bitacora_entrada=bitacora, objetivo_especifico_id=oid)
                for oid in objetivos_ids
            ])
        return bitacora

    @transaction.atomic
    def update(self, instance, validated_data):
        objetivos_ids = validated_data.pop("objetivos_ids", None)
        bitacora = super().update(instance, validated_data)
        if objetivos_ids is not None:
            BitacoraEntradaObjetivo.objects.filter(bitacora_entrada=bitacora).delete()
            if objetivos_ids:
                BitacoraEntradaObjetivo.objects.bulk_create([
                    BitacoraEntradaObjetivo(bitacora_entrada=bitacora, objetivo_especifico_id=oid)
                    for oid in objetivos_ids
                ])
        return bitacora
