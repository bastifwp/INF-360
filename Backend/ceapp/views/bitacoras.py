from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404

from ..models import BitacoraEntrada, BitacoraEntradaObjetivo, PlanTrabajo, ProfesionalPlanTrabajo
from ..serializers import BitacoraEntradaSerializer
from ..permissions import EsProfesional


class BitacoraEntradaView(APIView):         #se usa en front?
    """
    GET /bitacora-entrada/
    Lista todas las entradas de bitácora.

    POST /bitacora-entrada/
    Crea una nueva entrada de bitácora (solo profesionales).

    PUT /bitacora-entrada/
    Modifica una entrada (solo profesionales, requiere ID).

    DELETE /bitacora-entrada/
    Elimina una entrada (solo profesionales, requiere ID).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objetos = BitacoraEntrada.objects.all()
        serializer = BitacoraEntradaSerializer(objetos, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        serializer = BitacoraEntradaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(autor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(BitacoraEntrada, id=request.data.get('id'))
        serializer = BitacoraEntradaSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(autor=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(BitacoraEntrada, id=request.data.get('id'))
        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)


class BitacoraPorPlanView(APIView):
    """
    GET /bitacora/<id_plan>/
    Lista entradas de bitácora asociadas a un plan (si el usuario es cuidador o profesional).

    POST /bitacora/<id_plan>/
    Crea una entrada de bitácora con objetivos asociados (solo profesionales).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id_plan):
        user = request.user

        es_cuidador = PlanTrabajo.objects.filter(id=id_plan, cuidador=user).exists()
        es_profesional = ProfesionalPlanTrabajo.objects.filter(plan_trabajo_id=id_plan, profesional=user).exists()

        if not es_cuidador and not es_profesional:
            return Response({'detail': 'No autorizado para ver esta bitácora'}, status=status.HTTP_403_FORBIDDEN)

        entradas = BitacoraEntrada.objects.filter(plan_trabajo__id=id_plan).order_by('-fecha')
        serializer = BitacoraEntradaSerializer(entradas, many=True)

        new_data = serializer.data

        for entrada in new_data:
            objetivos_entradas = BitacoraEntradaObjetivo.objects.filter(bitacora_entrada=entrada['id'])

            new_list = []
            for objetivo_entrada in objetivos_entradas:
                new_list.append({
                    'id': objetivo_entrada.objetivo.id,
                    'categoria': objetivo_entrada.objetivo.categoria,
                    'titulo': objetivo_entrada.objetivo.titulo
                })

            entrada['selected_obj'] = new_list

        return Response(new_data)

    def post(self, request, id_plan):
        user = request.user

        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        esta_asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo_id=id_plan
        ).exists()

        if not esta_asociado:
            return Response({'detail': 'No autorizado para modificar este plan'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['plan_trabajo'] = id_plan
        data['fecha'] = timezone.now().date()

        serializer = BitacoraEntradaSerializer(data=data)

        if serializer.is_valid():
            entrada = serializer.save(autor=user)
            new_data = serializer.data
            new_data['selected_obj'] = data.get('selected_obj', [])
            return Response(new_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
