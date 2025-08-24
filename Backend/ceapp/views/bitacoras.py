# ceapp/views/bitacoras.py
from django.db.models import Prefetch
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ..models import (
    BitacoraEntrada,
    BitacoraEntradaObjetivo,
    PlanTrabajo,
    ProfesionalPlanTrabajo,
)
from ..serializers import BitacoraEntradaReadSerializer, BitacoraEntradaWriteSerializer
from ..permissions import EsProfesional


class BitacoraEntradaView(APIView):
    """
    GET    /bitacora-entrada/
    POST   /bitacora-entrada/
    PUT    /bitacora-entrada/
    DELETE /bitacora-entrada/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entradas = (
            BitacoraEntrada.objects
            .all()
            .prefetch_related(
                Prefetch(
                    "objetivos_relacionados",
                    queryset=BitacoraEntradaObjetivo.objects.select_related(
                        "objetivo_especifico",
                        "objetivo_especifico__objetivo_general",
                        "objetivo_especifico__objetivo_general__categoria",
                    ),
                )
            )
            .order_by('-fecha', '-id')
        )
        return Response(BitacoraEntradaReadSerializer(entradas, many=True).data)

    def post(self, request):
        # Solo profesionales pueden crear
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()

        # Compat: si el front envía selected_obj, mapear a objetivos_ids
        if 'selected_obj' in data and 'objetivos_ids' not in data:
            data['objetivos_ids'] = data.get('selected_obj', [])

        # Validar que venga plan_trabajo y que el profesional esté asociado a ese plan
        plan_id = data.get('plan_trabajo')
        if not plan_id:
            return Response({'plan_trabajo': ['Este campo es requerido.']}, status=status.HTTP_400_BAD_REQUEST)

        if not ProfesionalPlanTrabajo.objects.filter(
            profesional=request.user, plan_trabajo_id=plan_id
        ).exists():
            return Response({'detail': 'No autorizado para modificar este plan'}, status=status.HTTP_403_FORBIDDEN)

        # Setear fecha si no viene
        data.setdefault('fecha', timezone.now().date())

        write_ser = BitacoraEntradaWriteSerializer(data=data)
        if not write_ser.is_valid():
            return Response(write_ser.errors, status=status.HTTP_400_BAD_REQUEST)

        entrada = write_ser.save(autor=request.user)
        return Response(BitacoraEntradaReadSerializer(entrada).data, status=status.HTTP_201_CREATED)

    def put(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        obj = get_object_or_404(BitacoraEntrada, id=request.data.get('id'))

        # Permitir modificar solo si el profesional está asociado al plan de la bitácora
        if not ProfesionalPlanTrabajo.objects.filter(
            profesional=request.user, plan_trabajo=obj.plan_trabajo
        ).exists():
            return Response({'detail': 'No autorizado para modificar este plan'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()

        # Compat: selected_obj -> objetivos_ids
        if 'selected_obj' in data and 'objetivos_ids' not in data:
            data['objetivos_ids'] = data.get('selected_obj', [])

        write_ser = BitacoraEntradaWriteSerializer(obj, data=data, partial=True)
        if not write_ser.is_valid():
            return Response(write_ser.errors, status=status.HTTP_400_BAD_REQUEST)

        entrada = write_ser.save(autor=request.user)
        return Response(BitacoraEntradaReadSerializer(entrada).data)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        obj = get_object_or_404(BitacoraEntrada, id=request.data.get('id'))

        if not ProfesionalPlanTrabajo.objects.filter(
            profesional=request.user, plan_trabajo=obj.plan_trabajo
        ).exists():
            return Response({'detail': 'No autorizado para modificar este plan'}, status=status.HTTP_403_FORBIDDEN)

        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)


class BitacoraPorPlanView(APIView):
    """
    GET  /bitacora/<id_plan>/
    POST /bitacora/<id_plan>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id_plan):
        user = request.user

        es_cuidador = PlanTrabajo.objects.filter(id=id_plan, cuidador=user).exists()
        es_profesional = ProfesionalPlanTrabajo.objects.filter(plan_trabajo_id=id_plan, profesional=user).exists()
        if not es_cuidador and not es_profesional:
            return Response({'detail': 'No autorizado para ver esta bitácora'}, status=status.HTTP_403_FORBIDDEN)

        entradas = (
            BitacoraEntrada.objects
            .filter(plan_trabajo_id=id_plan)
            .prefetch_related(
                Prefetch(
                    "objetivos_relacionados",
                    queryset=BitacoraEntradaObjetivo.objects.select_related(
                        "objetivo_especifico",
                        "objetivo_especifico__objetivo_general",
                        "objetivo_especifico__objetivo_general__categoria",
                    ),
                )
            )
            .order_by('-fecha', '-id')
        )
        return Response(BitacoraEntradaReadSerializer(entradas, many=True).data)

    def post(self, request, id_plan):
        user = request.user

        # Solo profesionales pueden crear
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        # Validar que el profesional está asociado al plan del path
        if not ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo_id=id_plan
        ).exists():
            return Response({'detail': 'No autorizado para modificar este plan'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['plan_trabajo'] = id_plan
        data['fecha'] = timezone.now().date()

        # Compat: selected_obj -> objetivos_ids
        if 'selected_obj' in data and 'objetivos_ids' not in data:
            data['objetivos_ids'] = data.get('selected_obj', [])

        write_ser = BitacoraEntradaWriteSerializer(data=data)
        if not write_ser.is_valid():
            return Response(write_ser.errors, status=status.HTTP_400_BAD_REQUEST)

        entrada = write_ser.save(autor=user)
        return Response(BitacoraEntradaReadSerializer(entrada).data, status=status.HTTP_201_CREATED)
