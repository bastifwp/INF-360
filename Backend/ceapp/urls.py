from django.urls import path

# Importar vista
from .views import VistaCuidador, VistaProfesional

# Agregar path de nueva vista con su ruta
urlpatterns = [
    path('cuidador/', VistaCuidador.as_view()),
    path('profesional/', VistaProfesional.as_view()),
]