from django.urls import path

# Importar vista
from .views.views import VistaCuidador, VistaProfesional, RegisterView

# Agregar path de nueva vista con su ruta
urlpatterns = [
    path('cuidador/', VistaCuidador.as_view()),
    path('profesional/', VistaProfesional.as_view()),
    path('registro/', RegisterView.as_view()),
]