from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
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