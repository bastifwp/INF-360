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


from .chat import MensajeSerializer

ObjetivoSerializer = ObjetivoReadSerializer
ObjetivoPOSTSerializer = ObjetivoWriteSerializer

BitacoraEntradaSerializer = BitacoraEntradaReadSerializer
