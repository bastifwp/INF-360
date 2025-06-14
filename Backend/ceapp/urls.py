from django.urls import path

# Importar vista
from .views.views import (
    RegisterView,
    PlanTrabajoView,
    ObjetivoView,
    BitacoraEntradaView,
    ProfesionalPlanTrabajoView,
    BitacoraEntradaObjetivoView,
    CustomObtainPairView
)

#importar vistas para login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# Agregar path de nueva vista con su ruta
urlpatterns = [

    #Registro y login
    path('registro/', RegisterView.as_view(), name='registro'),
    path('token/', CustomObtainPairView.as_view(), name='obtener_tokens'),  #En teoría este verifica que existe al intenar logearse
    path('token/refresh/', TokenRefreshView.as_view(), name='reiniciar_token'), 

    path('plan-trabajo/', PlanTrabajoView.as_view(), name='plan-trabajo'),
    path('objetivo/', ObjetivoView.as_view(), name='objetivo'),
    path('bitacora-entrada/', BitacoraEntradaView.as_view(), name='bitacora-entrada'),
    path('profesional-plan-trabajo/', ProfesionalPlanTrabajoView.as_view(), name='profesional-plan-trabajo'),
    path('bitacora-entrada-objetivo/', BitacoraEntradaObjetivoView.as_view(), name='bitacora-entrada-objetivo'),
]