from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

from ..serializers import RegisterSerializer, CustomTokenObtainPairSerializer


class CustomObtainPairView(TokenObtainPairView):
    """
    POST /token/
    Login: Devuelve tokens JWT (access y refresh) si las credenciales son válidas.
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(APIView):
    """
    POST /registro/
    Crea un nuevo usuario con los datos enviados en el request.
    """
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
