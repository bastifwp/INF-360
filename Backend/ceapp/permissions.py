from rest_framework.permissions import BasePermission

class EsCuidador(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'cuidador'

class EsProfesional(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'profesional'