from django.urls import path

# Importar vista
from .views.views import (
    RegisterView,
    PlanTrabajoView,
    ObjetivoView,
    BitacoraEntradaView,
    ProfesionalPlanTrabajoView,
    BitacoraEntradaObjetivoView
)

# Agregar path de nueva vista con su ruta
urlpatterns = [
    path('registro/', RegisterView.as_view()),
    path('plan-trabajo/', PlanTrabajoView.as_view(), name='plan-trabajo'),
    path('objetivo/', ObjetivoView.as_view(), name='objetivo'),
    path('bitacora-entrada/', BitacoraEntradaView.as_view(), name='bitacora-entrada'),
    path('profesional-plan-trabajo/', ProfesionalPlanTrabajoView.as_view(), name='profesional-plan-trabajo'),
    path('bitacora-entrada-objetivo/', BitacoraEntradaObjetivoView.as_view(), name='bitacora-entrada-objetivo'),
]