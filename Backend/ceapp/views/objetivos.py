from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404
from ..models import Objetivo, ProfesionalPlanTrabajo
from ..serializers import ObjetivoSerializer, ObjetivoPOSTSerializer
from ..permissions import EsProfesional


class ObjetivoView(APIView):
    """
    GET /objetivos/
    Lista todos los objetivos.

    PUT /objetivos/
    Modifica un objetivo (solo profesionales, requiere ID).

    DELETE /objetivos/
    Elimina un objetivo (solo profesionales, requiere ID).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objetos = Objetivo.objects.all()
        serializer = ObjetivoSerializer(objetos, many=True)
        return Response(serializer.data)
    
    '''
        Este creo que no se ocupa -------------------> revisar para borrar
    def post(self, request, id_plan):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()
        data['plan_trabajo_id'] = id_plan
  
        serializer = ObjetivoPOSTSerializer(data=data)
        if serializer.is_valid():
            serializer.save(autor_creacion=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    '''

    def put(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(Objetivo, id=request.data.get('id'))
        serializer = ObjetivoSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(autor_modificacion=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj = get_object_or_404(Objetivo, id=request.data.get('id'))
        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)


class ObjetivosPorPlanView(APIView):
    """
    GET /objetivos/<id_plan>/
    Lista los objetivos asociados a un plan específico.

    POST /objetivos/<id_plan>/
    Crea un nuevo objetivo vinculado al plan (solo profesionales).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id_plan):
        user = request.user

        asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user, plan_trabajo__id=id_plan
        ).exists()

        if not asociado:
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        objetivos = Objetivo.objects.filter(plan_trabajo__id=id_plan)
        serializer = ObjetivoSerializer(objetivos, many=True)
        return Response(serializer.data)

    def post(self, request, id_plan):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        user = request.user
        asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user, plan_trabajo__id=id_plan
        ).exists()

        if not asociado:
            return Response({'detail': 'No autorizado al plan de trabajo'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['plan_trabajo'] = id_plan

        serializer = ObjetivoPOSTSerializer(data=data)
        if serializer.is_valid():
            serializer.save(autor_creacion=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ObjetivoDetailView(APIView):
    """
    GET /objetivos/detalle/<id_obj>/
    Devuelve un objetivo específico (si el usuario tiene acceso).

    PUT /objetivos/detalle/<id_obj>/
    Modifica un objetivo (si está asociado al plan).

    DELETE /objetivos/detalle/<id_obj>/
    Elimina un objetivo (si está asociado al plan).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, id_obj):
        user = request.user
        try:
            objetivo = Objetivo.objects.select_related('plan_trabajo').get(id=id_obj)
        except Objetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

        esta_asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo=objetivo.plan_trabajo
        ).exists()

        if not esta_asociado:
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ObjetivoSerializer(objetivo)
        return Response(serializer.data)

    def put(self, request, id_obj):
        obj = get_object_or_404(Objetivo, id=id_obj)

        user = request.user
        esta_asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo=obj.plan_trabajo
        ).exists()

        if not esta_asociado:
            return Response({'detail': 'No autorizado para modificar este objetivo'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ObjetivoSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(autor_modificacion=user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id_obj):
        obj = get_object_or_404(Objetivo, id=id_obj)
        user = request.user

        esta_asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo=obj.plan_trabajo
        ).exists()

        if not esta_asociado:
            return Response({'detail': 'No autorizado para eliminar este objetivo'}, status=status.HTTP_403_FORBIDDEN)

        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
