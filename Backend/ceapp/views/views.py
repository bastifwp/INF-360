from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import RegisterSerializer  
from ..permissions import EsCuidador, EsProfesional

# Clases de ejemplo

class VistaCuidador(APIView):
    permission_classes = [EsCuidador]

    def get(self, request):
        return Response({"mensaje": "Hola cuidador"})

class VistaProfesional(APIView):
    permission_classes = [EsProfesional]

    def get(self, request):
        return Response({"mensaje": "Hola profesional"})

class RegisterView(APIView):
    def post(self, request):
        print(request)

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)