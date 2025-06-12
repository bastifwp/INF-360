from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..serializers import (
    RegisterSerializer, PlanTrabajoSerializer, ProfesionalPlanTrabajoSerializer,
    ObjetivoSerializer, BitacoraEntradaSerializer, BitacoraEntradaObjetivoSerializer
)
from ..models import (
    PlanTrabajo, ProfesionalPlanTrabajo, Objetivo,
    BitacoraEntrada, BitacoraEntradaObjetivo
)
from ..permissions import EsCuidador, EsProfesional


class RegisterView(APIView):
    def post(self, request):
        print(request)

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PlanTrabajoView(APIView):
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
        obj_id = request.data.get('id')
        try:
            obj = PlanTrabajo.objects.get(id=obj_id)
        except PlanTrabajo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PlanTrabajoSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsCuidador().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj_id = request.data.get('id')
        try:
            obj = PlanTrabajo.objects.get(id=obj_id)
            obj.delete()
            return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
        except PlanTrabajo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)


class ObjetivoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objetos = Objetivo.objects.all()
        serializer = ObjetivoSerializer(objetos, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ObjetivoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(autor_creacion=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj_id = request.data.get('id')
        try:
            obj = Objetivo.objects.get(id=obj_id)
        except Objetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ObjetivoSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(autor_modificacion=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj_id = request.data.get('id')
        try:
            obj = Objetivo.objects.get(id=obj_id)
            obj.delete()
            return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
        except Objetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)


class BitacoraEntradaView(APIView):
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
        obj_id = request.data.get('id')
        try:
            obj = BitacoraEntrada.objects.get(id=obj_id)
        except BitacoraEntrada.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = BitacoraEntradaSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(autor=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj_id = request.data.get('id')
        try:
            obj = BitacoraEntrada.objects.get(id=obj_id)
            obj.delete()
            return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
        except BitacoraEntrada.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)


class ProfesionalPlanTrabajoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objetos = ProfesionalPlanTrabajo.objects.all()
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
        obj_id = request.data.get('id')
        try:
            obj = ProfesionalPlanTrabajo.objects.get(id=obj_id)
            obj.delete()
            return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
        except ProfesionalPlanTrabajo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)


class BitacoraEntradaObjetivoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        objetos = BitacoraEntradaObjetivo.objects.all()
        serializer = BitacoraEntradaObjetivoSerializer(objetos, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        serializer = BitacoraEntradaObjetivoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        obj_id = request.data.get('id')
        try:
            obj = BitacoraEntradaObjetivo.objects.get(id=obj_id)
            obj.delete()
            return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
        except BitacoraEntradaObjetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)
