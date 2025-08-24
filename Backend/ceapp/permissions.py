from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import ObjetivoGeneral, ObjetivoEspecifico, ProfesionalPlanTrabajo

class EsCuidador(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == "cuidador"


class EsProfesional(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "role", None) == "profesional"


class IsInPlanOrReadOnly(BasePermission):
    """
    Lectura: cualquiera autenticado.
    Escritura: solo profesionales asociados al plan del objetivo.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        # Para crear/editar/eliminar → además debe ser profesional
        return EsProfesional().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        # Identificar a qué plan pertenece el objeto
        if isinstance(obj, ObjetivoGeneral):
            plan_id = obj.plan_trabajo_id
        elif isinstance(obj, ObjetivoEspecifico):
            plan_id = obj.objetivo_general.plan_trabajo_id
        else:
            # Fallback: sin permiso de escritura
            return False

        return ProfesionalPlanTrabajo.objects.filter(
            profesional=request.user,
            plan_trabajo_id=plan_id
        ).exists()
