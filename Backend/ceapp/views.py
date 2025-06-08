from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


# Definir nuevos Endpoints
@api_view(['GET'])
def hola_mundo(request):
    return Response({"mensaje": "Hola mundo"})
