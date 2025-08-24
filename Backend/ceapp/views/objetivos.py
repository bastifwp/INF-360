# ceapp/views/objetivos.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter

from django.db.models import Count, Prefetch, Case, When, Value, IntegerField

from ..models import (
    ObjetivoGeneral,
    ObjetivoEspecifico,
    VinculacionObjetivoEspecifico,
    ProfesionalPlanTrabajo,
)
from ..serializers import (
    ObjetivoGeneralReadSerializer,
    ObjetivoGeneralWriteSerializer,
    ObjetivoEspecificoReadSerializer,
    ObjetivoEspecificoWriteSerializer,
)
from ..permissions import EsProfesional, IsInPlanOrReadOnly


class ObjetivoGeneralViewSet(viewsets.ModelViewSet):
    """
    CRUD de ObjetivoGeneral
    Filtros:
      - ?plan=<id>              (por plan de trabajo)
      - ?clasificacion=<0|1|2>  (0=Nuevo, 1=Activo, 2=Inactivo; filtro a nivel DB)
    """
    permission_classes = [permissions.IsAuthenticated, IsInPlanOrReadOnly]
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['fecha_modificacion', 'fecha_creacion', 'id', 'titulo']
    ordering = ['-fecha_modificacion', '-fecha_creacion', '-id']
    search_fields = ['titulo', 'descripcion', 'plan_trabajo__nombre']

    # QuerySet base optimizado (evita N+1)
    queryset = (
        ObjetivoGeneral.objects
        .select_related('plan_trabajo', 'categoria')
        .prefetch_related(Prefetch('objetivos_especificos'))
        .annotate(
            total_especificos=Count('objetivos_especificos', distinct=True),
            especificos_con_prof=Count('objetivos_especificos__vinculaciones', distinct=True),
            clasificacion_db=Case(
                When(total_especificos=0, then=Value(0)),      # Nuevo
                When(especificos_con_prof__gt=0, then=Value(1)),  # Activo
                default=Value(2),                              # Inactivo
                output_field=IntegerField(),
            )
        )
        .order_by('-fecha_modificacion', '-fecha_creacion', '-id')
    )

    def get_queryset(self):
        qs = self.queryset
        plan = self.request.query_params.get('plan')
        if plan:
            qs = qs.filter(plan_trabajo_id=plan)

        clasif = self.request.query_params.get('clasificacion')
        if clasif is not None:
            try:
                qs = qs.filter(clasificacion_db=int(clasif))
            except ValueError:
                pass

        return qs

    def get_serializer_class(self):
        return (
            ObjetivoGeneralWriteSerializer
            if self.action in ['create', 'update', 'partial_update']
            else ObjetivoGeneralReadSerializer
        )

    def perform_create(self, serializer):
        # Validar que el profesional esté asociado al plan
        plan_id = self.request.data.get('plan_trabajo')
        if not plan_id:
            raise ValidationError({"plan_trabajo": "Este campo es requerido."})

        if not ProfesionalPlanTrabajo.objects.filter(
            profesional=self.request.user, plan_trabajo_id=plan_id
        ).exists():
            raise PermissionDenied("No estás asociado a este plan de trabajo.")

        serializer.save(autor_creacion=self.request.user)

    def perform_update(self, serializer):
        serializer.save(autor_modificacion=self.request.user)


class ObjetivoEspecificoViewSet(viewsets.ModelViewSet):
    """
    CRUD de ObjetivoEspecifico
    Filtros:
      - ?objetivo_general=<id>
      - ?plan=<id>              (plan del objetivo general)
      - ?estado=<0|1|2>         (NL/ML/L)
      - ?clasificacion=<1|2>    (1=Activo, 2=Inactivo; filtro a nivel DB)

    Actions:
      - POST   /objetivos-especificos/{id}/vincular/     { "profesional_id": <id> }
      - DELETE /objetivos-especificos/{id}/desvincular/  { "profesional_id": <id> }
    """
    permission_classes = [permissions.IsAuthenticated, IsInPlanOrReadOnly]
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['fecha_modificacion', 'fecha_creacion', 'id', 'titulo', 'estado']
    ordering = ['-fecha_modificacion', '-fecha_creacion', '-id']
    search_fields = [
        'titulo', 'descripcion',
        'objetivo_general__titulo',
        'objetivo_general__plan_trabajo__nombre'
    ]

    # QuerySet base optimizado (evita N+1)
    queryset = (
        ObjetivoEspecifico.objects
        .select_related(
            'objetivo_general',
            'objetivo_general__plan_trabajo',
            'objetivo_general__categoria',
        )
        .prefetch_related('vinculaciones')
        .annotate(
            n_vinc=Count('vinculaciones', distinct=True),
            clasificacion_db=Case(
                When(n_vinc__gt=0, then=Value(1)),  # Activo
                default=Value(2),                    # Inactivo
                output_field=IntegerField(),
            )
        )
        .order_by('-fecha_modificacion', '-fecha_creacion', '-id')
    )

    def get_queryset(self):
        qs = self.queryset

        objg = self.request.query_params.get('objetivo_general')
        if objg:
            qs = qs.filter(objetivo_general_id=objg)

        plan = self.request.query_params.get('plan')
        if plan:
            qs = qs.filter(objetivo_general__plan_trabajo_id=plan)

        estado = self.request.query_params.get('estado')
        if estado is not None:
            try:
                qs = qs.filter(estado=int(estado))
            except ValueError:
                pass

        clasif = self.request.query_params.get('clasificacion')
        if clasif is not None:
            try:
                qs = qs.filter(clasificacion_db=int(clasif))
            except ValueError:
                pass

        return qs

    def get_serializer_class(self):
        return (
            ObjetivoEspecificoWriteSerializer
            if self.action in ['create', 'update', 'partial_update']
            else ObjetivoEspecificoReadSerializer
        )

    def perform_create(self, serializer):
        objg_id = self.request.data.get('objetivo_general')
        if not objg_id:
            raise ValidationError({"objetivo_general": "Este campo es requerido."})

        try:
            plan_id = ObjetivoGeneral.objects.only('plan_trabajo_id').get(id=objg_id).plan_trabajo_id
        except ObjetivoGeneral.DoesNotExist:
            raise ValidationError({"objetivo_general": "Objetivo general inexistente."})

        if not ProfesionalPlanTrabajo.objects.filter(
            profesional=self.request.user, plan_trabajo_id=plan_id
        ).exists():
            raise PermissionDenied("No estás asociado al plan de este objetivo.")

        serializer.save(autor_creacion=self.request.user)

    def perform_update(self, serializer):
        serializer.save(autor_modificacion=self.request.user)

    # --------- Vincular / Desvincular profesionales ---------

    def _check_prof_in_plan(self, profesional_id, objetivo_especifico):
        """Valida que el profesional pertenezca al plan del objetivo específico."""
        plan_id = objetivo_especifico.objetivo_general.plan_trabajo_id
        return ProfesionalPlanTrabajo.objects.filter(
            profesional_id=profesional_id, plan_trabajo_id=plan_id
        ).exists()

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticated, IsInPlanOrReadOnly, EsProfesional],
    )
    def vincular(self, request, pk=None):
        objetivo = self.get_object()  # dispara has_object_permission
        profesional_id = request.data.get('profesional_id') or request.user.id

        if not self._check_prof_in_plan(profesional_id, objetivo):
            return Response({'detail': 'Profesional no pertenece al plan.'}, status=status.HTTP_400_BAD_REQUEST)

        VinculacionObjetivoEspecifico.objects.get_or_create(
            objetivo_especifico=objetivo, profesional_id=profesional_id
        )
        return Response({'detail': 'Vinculado'}, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['delete'],
        permission_classes=[permissions.IsAuthenticated, IsInPlanOrReadOnly, EsProfesional],
    )
    def desvincular(self, request, pk=None):
        objetivo = self.get_object()  # dispara has_object_permission
        profesional_id = request.data.get('profesional_id') or request.user.id

        if not self._check_prof_in_plan(profesional_id, objetivo):
            return Response({'detail': 'Profesional no pertenece al plan.'}, status=status.HTTP_400_BAD_REQUEST)

        VinculacionObjetivoEspecifico.objects.filter(
            objetivo_especifico=objetivo, profesional_id=profesional_id
        ).delete()
        return Response({'detail': 'Desvinculado'}, status=status.HTTP_200_OK)
