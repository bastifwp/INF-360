# ceapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.auth import RegisterView, CustomObtainPairView
from .views.plan_trabajo import PlanTrabajoView, ProfesionalPlanTrabajoView
from .views.bitacoras import BitacoraEntradaView, BitacoraPorPlanView
from .views.relaciones import BitacoraEntradaObjetivoView

# --- NUEVOS viewsets para objetivos ---
from .views.objetivos import ObjetivoGeneralViewSet, ObjetivoEspecificoViewSet

from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'objetivos-generales', ObjetivoGeneralViewSet, basename='objetivo-general')
router.register(r'objetivos-especificos', ObjetivoEspecificoViewSet, basename='objetivo-especifico')

urlpatterns = [
    # Registro y login
    path('registro/', RegisterView.as_view(), name='registro'),
    path('token/', CustomObtainPairView.as_view(), name='obtener_tokens'),
    path('token/refresh/', TokenRefreshView.as_view(), name='reiniciar_token'),

    # Plan de trabajo
    path('plan-trabajo/', PlanTrabajoView.as_view(), name='plan-trabajo'),
    path('profesional-plan-trabajo/', ProfesionalPlanTrabajoView.as_view(), name='profesional-plan-trabajo'),

    # Bitácoras
    path('bitacora-entrada/', BitacoraEntradaView.as_view(), name='bitacora-entrada'),
    path('bitacora/<int:id_plan>/', BitacoraPorPlanView.as_view(), name='bitacora-por-plan'),

    # Relaciones (through de bitácora <-> objetivo específico)
    path('bitacora-entrada-objetivo/', BitacoraEntradaObjetivoView.as_view(), name='bitacora-entrada-objetivo'),

    # Rutas nuevas de objetivos (CRUD completo)
    path('', include(router.urls)),
]
