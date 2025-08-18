# ceapp/serializers/__init__.py

from .auth import CustomTokenObtainPairSerializer, RegisterSerializer
from .plan_trabajo import PlanTrabajoSerializer
from .objetivos import (
    ObjetivoReadSerializer,
    ObjetivoWriteSerializer,
    ObjetivoLiteSerializer,
)
from .bitacoras import (
    BitacoraEntradaReadSerializer,
    BitacoraEntradaWriteSerializer,
)
from .relaciones import (
    ProfesionalPlanTrabajoSerializer,
    BitacoraEntradaObjetivoSerializer,
)

# --- ALIAS DE COMPATIBILIDAD PARA LAS VIEWS ACTUALES ---
# Lo que antes se llamaba así:
ObjetivoSerializer = ObjetivoReadSerializer
ObjetivoPOSTSerializer = ObjetivoWriteSerializer
# (Si alguna view usa este nombre “antiguo”, seguirá resolviendo)
# Si alguna view usa BitacoraEntradaSerializer y falla en POST,
# cambia este alias a BitacoraEntradaWriteSerializer o ajusta esa view.
BitacoraEntradaSerializer = BitacoraEntradaReadSerializer
