from django.shortcuts import render
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..serializers import (
    RegisterSerializer, PlanTrabajoSerializer, ProfesionalPlanTrabajoSerializer,
    ObjetivoSerializer, BitacoraEntradaSerializer, BitacoraEntradaObjetivoSerializer,
    CustomTokenObtainPairSerializer
)
from ..models import (
    PlanTrabajo, ProfesionalPlanTrabajo, Objetivo,
    BitacoraEntrada, BitacoraEntradaObjetivo, CustomUser
)
from ..permissions import EsCuidador, EsProfesional

#Lo importamos para extenderlo y poder ocupar el serializer q definimos
from rest_framework_simplejwt.views import TokenObtainPairView


#overwrite al serializer por default al nuestro
class CustomObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



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

class ObjetivosPorPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_plan):
        user = request.user

        # Verifica si el usuario está asociado a ese plan
        asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user, plan_trabajo__id=id_plan
        ).exists()

        if not asociado:
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        # Si está asociado, devuelve los objetivos
        objetivos = Objetivo.objects.filter(plan_trabajo__id=id_plan)
        serializer = ObjetivoSerializer(objetivos, many=True)
        return Response(serializer.data)

    def post(self, request, id_plan):
        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        user = request.user

        # Verificar que el profesional esté asociado al plan
        asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user, plan_trabajo__id=id_plan
        ).exists()

        if not asociado:
            return Response({'detail': 'No autorizado al plan de trabajo'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['plan_trabajo'] = id_plan

        serializer = ObjetivoSerializer(data=data)
        if serializer.is_valid():
            serializer.save(autor_creacion=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ObjetivoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_obj):
        user = request.user

        try:
            objetivo = Objetivo.objects.select_related('plan_trabajo').get(id=id_obj)
        except Objetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el usuario es un profesional asociado al plan del objetivo
        esta_asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo=objetivo.plan_trabajo
        ).exists()

        if not esta_asociado:
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ObjetivoSerializer(objetivo)
        return Response(serializer.data)

    def put(self, request, id_obj):
        try:
            obj = Objetivo.objects.get(id=id_obj)
        except Objetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        # Verificar que el profesional esté asociado al plan del objetivo
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
        try:
            obj = Objetivo.objects.get(id=id_obj)
        except Objetivo.DoesNotExist:
            return Response({'detail': 'No encontrado'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        esta_asociado = ProfesionalPlanTrabajo.objects.filter(
            profesional=user,
            plan_trabajo=obj.plan_trabajo
        ).exists()

        if not esta_asociado:
            return Response({'detail': 'No autorizado para eliminar este objetivo'}, status=status.HTTP_403_FORBIDDEN)

        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
    
class BitacoraPorPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_plan):
        user = request.user

        # Verificar si es cuidador del plan
        es_cuidador = PlanTrabajo.objects.filter(id=id_plan, cuidador=user).exists()

        # Verificar si es profesional asignado al plan
        es_profesional = ProfesionalPlanTrabajo.objects.filter(plan_trabajo_id=id_plan, profesional=user).exists()

        if not es_cuidador and not es_profesional:
            return Response({'detail': 'No autorizado para ver esta bitácora'}, status=status.HTTP_403_FORBIDDEN)

        entradas = BitacoraEntrada.objects.filter(plan_trabajo__id=id_plan)
        serializer = BitacoraEntradaSerializer(entradas, many=True)
        return Response(serializer.data)

    def post(self, request, id_plan):
        user = request.user

        if not EsProfesional().has_permission(request, self):
            return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

        # Validar que el profesional tenga vínculo con el plan
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

            # Asociar objetivos si vienen
            selected_obj = request.data.get('selected_obj', [])
            for obj_id in selected_obj:
                try:
                    obj = Objetivo.objects.get(id=obj_id)
                    BitacoraEntradaObjetivo.objects.create(bitacora_entrada=entrada, objetivo=obj)
                except Objetivo.DoesNotExist:
                    continue

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)