from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import BitacoraEntradaObjetivo
from ..serializers import BitacoraEntradaObjetivoSerializer
from ..permissions import EsProfesional


class BitacoraEntradaObjetivoView(APIView):
    """
    GET /bitacora-entrada-objetivo/
    Lista todas las relaciones bitácora-objetivo.

    POST /bitacora-entrada-objetivo/
    Crea una nueva relación (solo profesionales).

    DELETE /bitacora-entrada-objetivo/
    Elimina una relación (solo profesionales, requiere ID).
    """
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
        obj = get_object_or_404(BitacoraEntradaObjetivo, id=request.data.get('id'))
        obj.delete()
        return Response({'detail': 'Eliminado'}, status=status.HTTP_204_NO_CONTENT)
