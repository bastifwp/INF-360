# admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    CustomUser,
    PlanTrabajo, ProfesionalPlanTrabajo, Mensaje,
    CategoriaObjetivo, ObjetivoGeneral, ObjetivoEspecifico,
    VinculacionObjetivoEspecifico, BitacoraEntrada, BitacoraEntradaObjetivo
)

# -------------------------
# Usuarios
# -------------------------
from django.contrib.auth.admin import UserAdmin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "first_name", "last_name", "email", "role", "cargo", "institucion", "is_active")
    list_filter = ("role", "is_active", "is_staff", "is_superuser")
    search_fields = ("username", "first_name", "last_name", "email")
    fieldsets = UserAdmin.fieldsets + (
        ("Rol y organización", {"fields": ("role", "cargo", "institucion")}),
    )


# -------------------------
# Inlines
# -------------------------
class ObjetivoEspecificoInline(admin.TabularInline):
    model = ObjetivoEspecifico
    extra = 0
    fields = ("titulo", "estado", "autor_creacion", "fecha_creacion")
    readonly_fields = ("autor_creacion", "fecha_creacion")
    autocomplete_fields = ("autor_creacion", "autor_modificacion")

class VinculacionObjetivoEspecificoInline(admin.TabularInline):
    model = VinculacionObjetivoEspecifico
    extra = 0
    autocomplete_fields = ("profesional",)

class BitacoraEntradaObjetivoInline(admin.TabularInline):
    model = BitacoraEntradaObjetivo
    extra = 0
    autocomplete_fields = ("objetivo_especifico",)


# -------------------------
# Admin: Plan de trabajo
# -------------------------
@admin.register(PlanTrabajo)
class PlanTrabajoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "cuidador_nombre", "profesionales_count", "objetivos_generales_count")
    search_fields = ("nombre", "cuidador__username", "cuidador__first_name", "cuidador__last_name")
    autocomplete_fields = ("cuidador",)

    def cuidador_nombre(self, obj):
        c = obj.cuidador
        return f"{c.first_name} {c.last_name}".strip() or c.username
    cuidador_nombre.short_description = "Cuidador"

    def profesionales_count(self, obj):
        return obj.profesionales.count()
    profesionales_count.short_description = "N° profesionales"

    def objetivos_generales_count(self, obj):
        return obj.objetivos_generales.count()
    objetivos_generales_count.short_description = "N° obj. generales"


@admin.register(ProfesionalPlanTrabajo)
class ProfesionalPlanTrabajoAdmin(admin.ModelAdmin):
    list_display = ("id", "plan_trabajo", "profesional")
    list_filter = ("plan_trabajo",)
    search_fields = ("plan_trabajo__nombre", "profesional__username", "profesional__first_name", "profesional__last_name")
    autocomplete_fields = ("plan_trabajo", "profesional")


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ("id", "plan", "autor", "short_contenido", "timestamp")
    list_filter = ("plan", "autor")
    search_fields = ("contenido", "autor__username", "autor__first_name", "autor__last_name")
    autocomplete_fields = ("plan", "autor")
    date_hierarchy = "timestamp"

    def short_contenido(self, obj):
        return (obj.contenido[:60] + "…") if len(obj.contenido) > 60 else obj.contenido
    short_contenido.short_description = "Contenido"


# -------------------------
# Admin: Objetivos
# -------------------------
@admin.register(CategoriaObjetivo)
class CategoriaObjetivoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "descripcion")
    search_fields = ("nombre",)


@admin.register(ObjetivoGeneral)
class ObjetivoGeneralAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "plan_trabajo", "categoria_display", "clasificacion_display", "autor_creacion", "fecha_creacion")
    list_filter = ("plan_trabajo", "categoria")
    search_fields = ("titulo", "descripcion", "plan_trabajo__nombre")
    autocomplete_fields = ("plan_trabajo", "categoria", "autor_creacion", "autor_modificacion")
    readonly_fields = ("fecha_creacion", "fecha_modificacion", "clasificacion_display")
    inlines = [ObjetivoEspecificoInline]

    def categoria_display(self, obj):
        return getattr(obj.categoria, "nombre", obj.categoria) if obj.categoria else None
    categoria_display.short_description = "Categoría"

    def clasificacion_display(self, obj):
        mapping = {0: "Nuevo", 1: "Activo", 2: "Inactivo"}
        return mapping.get(obj.clasificacion, obj.clasificacion)
    clasificacion_display.short_description = "Clasificación"


@admin.register(ObjetivoEspecifico)
class ObjetivoEspecificoAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "objetivo_general", "estado", "clasificacion_display", "autor_creacion", "fecha_creacion")
    list_filter = ("estado", "objetivo_general__plan_trabajo")
    search_fields = ("titulo", "descripcion", "objetivo_general__titulo", "objetivo_general__plan_trabajo__nombre")
    autocomplete_fields = ("objetivo_general", "autor_creacion", "autor_modificacion")
    readonly_fields = ("fecha_creacion", "fecha_modificacion", "clasificacion_display")
    inlines = [VinculacionObjetivoEspecificoInline]

    def clasificacion_display(self, obj):
        return "Activo" if obj.clasificacion == 1 else "Inactivo"
    clasificacion_display.short_description = "Clasificación"


# -------------------------
# Admin: Bitácoras
# -------------------------
@admin.register(BitacoraEntrada)
class BitacoraEntradaAdmin(admin.ModelAdmin):
    list_display = ("id", "plan_trabajo", "fecha", "titulo", "autor")
    list_filter = ("plan_trabajo", "fecha")
    search_fields = ("titulo", "comentarios", "plan_trabajo__nombre", "autor__username", "autor__first_name", "autor__last_name")
    autocomplete_fields = ("plan_trabajo", "autor")
    date_hierarchy = "fecha"
    inlines = [BitacoraEntradaObjetivoInline]


@admin.register(BitacoraEntradaObjetivo)
class BitacoraEntradaObjetivoAdmin(admin.ModelAdmin):
    list_display = ("id", "bitacora_entrada", "objetivo_especifico")
    list_filter = ("bitacora_entrada__plan_trabajo",)
    search_fields = ("bitacora_entrada__titulo", "objetivo_especifico__titulo")
    autocomplete_fields = ("bitacora_entrada", "objetivo_especifico")
