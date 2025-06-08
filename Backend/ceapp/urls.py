from django.urls import path

# Importar vista
from .views import hola_mundo

# Agregar path de nueva vista con su ruta
urlpatterns = [
    path('hola/', hola_mundo),
]