from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Mensaje, PlanTrabajo, ProfesionalPlanTrabajo
from ..serializers.chat import MensajeSerializer, UltimaLecturaSerializer
from django.utils.dateparse import parse_datetime

class MensajeView(APIView):
    '''
    GET /chat/<plan_id>/mensajes/
    Lista todos los mensajes de un plan.

    '''
    permission_classes = [IsAuthenticated]

    def get(self, request, plan_id):
        plan = get_object_or_404(PlanTrabajo, id=plan_id)
        mensajes = Mensaje.objects.filter(plan=plan).order_by("timestamp")
        serializer = MensajeSerializer(mensajes, many=True)
        return Response(serializer.data)
    



class UltimaLecturaView(APIView):
    '''
    GET chat/ultima-lectura/<plan_id>
    Entrega la fecha de ultima lectura almacenada en la base de datos

    PATCH chat/ultima-lectura/<plan_id>
    Actualiza el campo última lectura  

    '''
    permission_classes = [IsAuthenticated]

    #Función que maneja consultas get a la ruta
    def get(self, request, plan_id):
        #Buscamos en la base de datos
        relacion = ProfesionalPlanTrabajo.objects.filter(
            plan_trabajo_id=plan_id,
            profesional=request.user
        ).first()

        #En caso que no se haya encontrado la relacion retornar error
        if not relacion:
            return Response(
                {"detail": "No existe relación profesional-plan"},
                status=status.HTTP_404_NOT_FOUND
            )    
        
        #Si es que si se encontró la relacion
        serializer = UltimaLecturaSerializer(relacion) #Retornamos al frontend según como definimos en serializer
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    #Función que maneja consultas patch a la ruta
    def patch(self, request, plan_id):

        #Buscamos en la base de datos
        relacion = ProfesionalPlanTrabajo.objects.filter(
            plan_trabajo_id=plan_id,
            profesional=request.user
        ).first()

        #En caso que no se haya encontrado la relacion retornar error
        if not relacion:
            return Response(
                {"detail": "No existe relación profesional-plan"},
                status=status.HTTP_404_NOT_FOUND
            )    

        #Actualizamos utilizando el serializer
        serializer = UltimaLecturaSerializer(relacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      
               