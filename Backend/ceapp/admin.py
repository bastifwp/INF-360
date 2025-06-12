from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, PlanTrabajo, ProfesionalPlanTrabajo, Objetivo, BitacoraEntrada, BitacoraEntradaObjetivo

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'cargo', 'institucion')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'cargo', 'institucion')}),
    )

class ObjetivoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor_creacion', 'fecha_creacion', 'autor_modificacion', 'fecha_modificacion')
    readonly_fields = ('fecha_creacion', 'fecha_modificacion')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(PlanTrabajo)
admin.site.register(ProfesionalPlanTrabajo)
admin.site.register(Objetivo, ObjetivoAdmin)
admin.site.register(BitacoraEntrada)
admin.site.register(BitacoraEntradaObjetivo)