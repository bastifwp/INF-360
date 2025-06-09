from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('cuidador', 'Cuidador'),
        ('profesional', 'Profesional'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)


# Ejemplo

# class Paciente(models.Model):
#     nombre = models.CharField(max_length=100)
#     correo = models.EmailField(unique=True)
#     fecha_inscripcion = models.DateField(auto_now_add=True)

#     def __str__(self):
#         return self.nombre