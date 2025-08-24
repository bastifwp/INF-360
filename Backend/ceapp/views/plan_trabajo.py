from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import PlanTrabajo, ProfesionalPlanTrabajo
from ..serializers import PlanTrabajoSerializer, ProfesionalPlanTrabajoSerializer
from ..permissions import EsCuidador, EsProfesional


class PlanTrabajoView(APIView):
    """
    GET /plan_trabajo/
    Lista todos los planes de trabajo (requiere autenticación).

    POST /plan_trabajo/
    Crea un plan de trabajo (solo para cuidadores).

    PUT /plan_trabajo/
    Edita un plan de trabajo (solo cuidadores, requiere ID en el body).

    DELETE /plan_trabajo/
    Elimina un plan de trabajo (solo cuidadores, requiere ID en el body).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objetos = PlanTrabajo.objects.all()
        serializer = PlanTrabajoSerializer(objetos, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not EsCuidador().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PlanTrabajoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not EsCuidador().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(PlanTrabajo, id=request.data.get('id'))
        serializer = PlanTrabajoSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsCuidador().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(PlanTrabajo, id=request.data.get('id'))
        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)


class ProfesionalPlanTrabajoView(APIView):
    """
    GET /profesional_plan_trabajo/
    Lista los planes asociados al profesional autenticado.

    POST /profesional_plan_trabajo/
    Asigna un profesional a un plan de trabajo (solo profesionales).

    DELETE /profesional_plan_trabajo/
    Elimina una asignación profesional-plan (solo profesionales).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        objetos = ProfesionalPlanTrabajo.objects.filter(profesional=user)
        serializer = ProfesionalPlanTrabajoSerializer(objetos, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ProfesionalPlanTrabajoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(ProfesionalPlanTrabajo, id=request.data.get('id'))
        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)