from .auth import CustomTokenObtainPairSerializer, RegisterSerializer
from .plan_trabajo import PlanTrabajoSerializer

# --- Objetivos (nueva separación) ---
from .objetivos import (
    ObjetivoGeneralReadSerializer,
    ObjetivoGeneralWriteSerializer,
    ObjetivoGeneralLiteSerializer,
    ObjetivoEspecificoReadSerializer,
    ObjetivoEspecificoWriteSerializer,
    ObjetivoEspecificoLiteSerializer,
)

from .bitacoras import (
    BitacoraEntradaReadSerializer,
    BitacoraEntradaWriteSerializer,
)

from .relaciones import (
    ProfesionalPlanTrabajoSerializer,
    BitacoraEntradaObjetivoReadSerializer,
    BitacoraEntradaObjetivoWriteSerializer,
    BitacoraEntradaObjetivoSerializer,  # alias al Read para compatibilidad
)

# --------------------------------------------------------------------
# Aliases de compatibilidad (para que no fallen imports antiguos)
# --------------------------------------------------------------------

# Alias antiguos del modelo Objetivo -> ahora apuntan a ObjetivoGeneral
ObjetivoSerializer = ObjetivoGeneralReadSerializer
ObjetivoPOSTSerializer = ObjetivoGeneralWriteSerializer
ObjetivoLiteSerializer = ObjetivoGeneralLiteSerializer
ObjetivoReadSerializer = ObjetivoGeneralReadSerializer
ObjetivoWriteSerializer = ObjetivoGeneralWriteSerializer

# Para comodidad en vistas/bitácoras
BitacoraEntradaSerializer = BitacoraEntradaReadSerializer
