from django.urls import path

# Importar vista
from .views.auth import RegisterView, CustomObtainPairView
from .views.plan_trabajo import PlanTrabajoView, ProfesionalPlanTrabajoView
from .views.objetivos import ObjetivoView, ObjetivosPorPlanView, ObjetivoDetailView
from .views.bitacoras import BitacoraEntradaView, BitacoraPorPlanView
from .views.relaciones import BitacoraEntradaObjetivoView

# Importar vistas para login
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Registro y login
    path('registro/', RegisterView.as_view(), name='registro'),
    path('token/', CustomObtainPairView.as_view(), name='obtener_tokens'),
    path('token/refresh/', TokenRefreshView.as_view(), name='reiniciar_token'),

    # Plan de trabajo
    path('plan-trabajo/', PlanTrabajoView.as_view(), name='plan-trabajo'),
    path('profesional-plan-trabajo/', ProfesionalPlanTrabajoView.as_view(), name='profesional-plan-trabajo'),

    # Objetivos
    path('objetivos/', ObjetivoView.as_view(), name='objetivo'),  # si aún usas el GET general
    path('objetivos/<int:id_plan>/', ObjetivosPorPlanView.as_view(), name='objetivos-por-plan'),
    path('objetivos/detalle/<int:id_obj>/', ObjetivoDetailView.as_view(), name='objetivo-detalle'),

    # Bitácoras
    path('bitacora-entrada/', BitacoraEntradaView.as_view(), name='bitacora-entrada'),
    path('bitacora/<int:id_plan>/', BitacoraPorPlanView.as_view(), name='bitacora-por-plan'),

    # Relaciones entre bitácora y objetivos
    path('bitacora-entrada-objetivo/', BitacoraEntradaObjetivoView.as_view(), name='bitacora-entrada-objetivo'),
]
