import { Ionicons } from "@expo/vector-icons";
import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { CustomModal } from "@/components/base/Modal";
import { TextoBloque } from "@/components/base/TextoBloque";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { Titulo, TituloSeccion } from "@/components/base/Titulo";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { formatearFechaDDMMYYYY } from "@/components/base/FormatearFecha";
import { TarjetaExpandido, TarjetaPequeña } from "@/components/base/Tarjeta";
import { FiltroActivoInactivo, ObjetivoBadge } from "@/components/vistas/plan/Componentes";
import { BotonAgregar, BotonDetalles, BotonDesvincular, BotonEditar, BotonEliminar, BotonVincular } from "@/components/base/Boton";

//PROFESIONALES (VINCULADOS AL OBJETIVO ESPECÍFICO)
interface Profesional {
  id: string;
  nombre: string;
}
const mockProfesionales = [
  {
    id: "1",
    nombre: "Dra. Valentina Ríos",
  },
  {
    id: "2",
    nombre: "Dr. Nicolás Fuentes",
  },
  {
    id: "3",
    nombre: "María José Pérez",
  },
  {
    id: "4",
    nombre: "María José Pérez",
  },
  {
    id: "5",
    nombre: "María José Pérez",
  },
  {
    id: "6",
    nombre: "María José Pérez",
  },
  {
    id: "7",
    nombre: "María José Pérez",
  },
  {
    id: "8",
    nombre: "María Jesus de los Ángeles Pérez Rodriguez",
  },
];

//OBJETIVO ESPECÍFICO
interface ObjetivoEspecifico {
  id: string;
  titulo: string;
  estado: 1 | 2 | 3; //1: Logrado; 2: Medianamente logrado; 3: No logrado
  descripcion?: string;
  vinculado?: boolean;
  autor_creacion: string;
  fecha_creacion: string;
  autor_modificacion?: string;
  fecha_modificacion?: string;
  clasificacion: 1 | 2; //1: Activo; 2: Inactivo
}
const estadosMap: Record<number, string> = {
  1: "Logrado (L)",
  2: "Medianamente logrado (ML)",
  3: "No logrado (NL)",
};
const clasificacionMap: Record<number, string> = {
  1: "Activo",
  2: "Inactivo",
};
const mockObjetivosEspecificos: ObjetivoEspecifico[] =  [
  {
    id: "1",
    titulo: "Reconoce vocales",
    estado: 1,
    descripcion: "Hola...",
    autor_creacion: "Eva",
    fecha_creacion: "06/06/06",
    autor_modificacion: "Eva",
    fecha_modificacion: "07/07/2025",
    clasificacion: 1,
    vinculado: true,
  },
  {
    id: "2",
    titulo: "Pronuncia la letra R correctamente",
    estado: 2,
    autor_creacion: "Eva",
    fecha_creacion: "06/06/2025",
    autor_modificacion: "Eva",
    fecha_modificacion: "07/07/2025",
    clasificacion: 1,
    vinculado: false,
  },
  {
    id: "3",
    titulo: "Pronuncia la letra R correctamente",
    estado: 3,
    autor_creacion: "Eva",
    fecha_creacion: "06/06/2025",
    autor_modificacion: "Eva",
    fecha_modificacion: "07/07/2025",
    clasificacion: 2,
    vinculado: false,
  },
];

//ICONO: OBJETIVO ESPECÍFICO
interface ObjetivoEspecificoIconoProps {
  estado: 1 | 2 | 3;
  clasificacion: 1 | 2;
}
export function ObjetivoEspecificoIcono({
  estado,
  clasificacion
}: ObjetivoEspecificoIconoProps) {
  return (
    <View className="relative w-[50px] h-[50px]">
      { clasificacion === 2 ? (
        <Ionicons
          name={"ellipse"}
          size={50}
          color={colors.mediumgrey}
        />
      ) : estado === 1 ? (
        <Ionicons
          name={"checkmark-circle"}
          size={50}
          color={colors.mediumgreen}
        />
      ) : estado === 2 ? (
        <Ionicons
          name={"contrast"}
          size={50}
          color={colors.mediumyellow}
        />
      ) : estado === 3 ? (
        <Ionicons
          name={"close-circle"}
          size={50}
          color={colors.mediumred}
        />
      ) : (
        <Ionicons
          name={"ellipse"}
          size={50}
          color={colors.mediumgrey}
        />
      )
      }
    </View>
  )
}

//ÍTEM: OBJETIVO ESPECÍFICO
interface ObjetivoEspecificoItemProps {
  objetivoEspecifico: ObjetivoEspecifico;
  onChange: () => void;
}
const ObjetivoEspecificoItem = ({ objetivoEspecifico, onChange }: ObjetivoEspecificoItemProps) => {

  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  const isProfesional = user?.role === "profesional";

  const router = useRouter();
  
  const { paciente } = useLocalSearchParams();

  //ESTADOS
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  //FETCH: PROFESIONALES (VINCULADOS AL OBJETIVO ESPECÍFICO)
  const fetchProfesionales = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[plan] Obteniendo profesionales vinculados al objetivo específico", objetivoEspecifico.id);
      setProfesionales(mockProfesionales);
      setError(false);
    } catch (err) {
      console.log("[plan] Error:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  //HANDLE: EDITAR
  const handleEditar = () => {
    console.log("[plan] Editando objetivo específico", objetivoEspecifico.id);
    router.push(`/profesional/${paciente}/plan/objetivo-especifico-agregar?id=${objetivoEspecifico.id}`);
  };

  //HANDLE: ELIMINAR
  const handleEliminar = () => {
    console.log("[plan] Eliminando objetivo específico", objetivoEspecifico.id);
  };
  
  //HANDLE: VINCULAR
  const handleVincular = () => {
    console.log("[plan] Vinculando al objetivo específico", objetivoEspecifico.id);
  };

  //HANDLE: DESVINCULAR
  const handleDesvincular = () => {
    console.log("[plan] Desvinculando del objetivo específico", objetivoEspecifico.id);
  };

  //VISTA
  return (
    <View className="relative">
      {objetivoEspecifico.vinculado === true && (
        <ObjetivoBadge
          fondoColor={colors.secondary}
          texto={"Vinculado"}
          textoColor={colors.white}
        />
      )}
      <TarjetaExpandido
        tarjetaEstilo={objetivoEspecifico.clasificacion === 2 ? "bg-lightgrey p-4 mb-4 opacity-50" : "bg-lightgrey p-4 mb-4"}
        titulo={objetivoEspecifico.titulo}
        subtitulo={[ `Estado: ${estadosMap[objetivoEspecifico.estado]}` ]}
        icono={<ObjetivoEspecificoIcono estado={objetivoEspecifico.estado} clasificacion={objetivoEspecifico.clasificacion}/>}
        expandidoContenido={
          <View className="gap-4">
            {objetivoEspecifico.descripcion && objetivoEspecifico.descripcion.length > 0 && (<TextoBloque texto={objetivoEspecifico.descripcion}/>)}
            <View className="gap-2">
              <TituloSeccion children={"Opciones:"}/>
              <View className="gap-2">
                <View className="flex-row flex-wrap items-center justify-between gap-1" style={{ flexShrink: 1 }}>
                  {isProfesional ? (
                    objetivoEspecifico.vinculado === true ? (
                      <>
                        <BotonDesvincular onPress={handleDesvincular}/>
                        <BotonEditar onPress={handleEditar}/>
                        <BotonEliminar onPress={handleEliminar}/>
                      </>
                    ) : (
                      <BotonVincular onPress={handleVincular}/>
                    )
                  ) : null}
                  <BotonDetalles tipoModal={"0"} onOpen={fetchProfesionales}>
                    <View className="rounded-lg py-2 gap-2">
                      <TituloSeccion
                        children={"Autor:"}
                        respuesta={`${objetivoEspecifico.autor_creacion} (${formatearFechaDDMMYYYY(objetivoEspecifico.fecha_creacion)})`}
                      />
                      {objetivoEspecifico.autor_modificacion && objetivoEspecifico.fecha_modificacion && (
                        <TituloSeccion
                          children={"Última modificación:"}
                          respuesta={`${objetivoEspecifico.autor_modificacion} (${formatearFechaDDMMYYYY(objetivoEspecifico.fecha_modificacion)})`}
                        />
                      )}
                      <TituloSeccion
                        children={"Clasificación:"}
                        respuesta={clasificacionMap[objetivoEspecifico.clasificacion]}
                      />
                      <TituloSeccion
                        children={"Profesionales vinculados:"}
                      />
                      {isLoading ? (
                        <IndicadorCarga />
                      ) : error ? (
                        <MensajeVacio
                          mensaje={`Hubo un error al cargar los profesionales vinculados al objetivo específico.\nIntenta nuevamente.`}
                          onPressRecargar={fetchProfesionales}
                        />
                      ) : profesionales.length === 0 ? (
                        <MensajeVacio mensaje={"El objetivo específico aún no tiene profesionales vinculados."}/>
                      ) : (
                        profesionales.map((profesional, index) => (
                          <TarjetaPequeña
                            key={index}
                            titulo={profesional.nombre}
                            icono={<Ionicons name="person" size={16} color="black"/>}
                          />
                        ))
                      )}
                    </View>
                  </BotonDetalles>
                </View>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

//LISTA: OBJETIVOS ESPECÍFICOS
interface ObjetivosEspecificosListaProps {
  objetivosEspecificos: ObjetivoEspecifico[];
  onChange: () => void;
}
export function ObjetivosEspecificosLista({ objetivosEspecificos, onChange }: ObjetivosEspecificosListaProps) {
  return (
    <FlatList
      data={objetivosEspecificos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ObjetivoEspecificoItem objetivoEspecifico={item} onChange={onChange}/>}
    />
  );
};

//MODAL: OBJETIVOS ESPECÍFICOS
interface ObjetivosEspecificosModalProps {
  visible: boolean;
  onClose: () => void;
  objetivoGeneralID: string;
}
export function ObjetivosEspecificosModal({
  visible,
  onClose,
  objetivoGeneralID,
}: ObjetivosEspecificosModalProps) {
  
  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  if (!user) return null;
  const isProfesional = user?.role === "profesional";

  const router = useRouter();

  const { paciente } = useLocalSearchParams();

  //ESTADOS
  const [objetivosEspecificos, setObjetivosEspecificos] = useState<ObjetivoEspecifico[]>([]);
  const [showActivos, setShowActivos] = useState(true);
  const [showInactivos, setShowInactivos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (visible) fetchObjetivosEspecificos();
  }, [visible, authToken, refreshToken]);

  //FETCH: OBJETIVOS ESPECÍFICOS
  const fetchObjetivosEspecificos = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[plan] Obteniendo objetivos específicos del objetivo general", objetivoGeneralID);
      setObjetivosEspecificos(mockObjetivosEspecificos);
      setError(false);
    } catch (err) {
      console.log("[plan] Error:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  //HANDLE: AGREGAR-OBJETIVO-ESPECIFICO
  const handleAgregarObjetivoEspecifico = () => {
    console.log("[plan] Agregando objetivo específico del objetivo", objetivoGeneralID);
    router.push(`/profesional/${paciente}/plan/objetivo-especifico-agregar`);
  };

  //FILTRO: CLASIFICACIÓN
  const objetivosEspecificosFiltrados = objetivosEspecificos.filter(objetivoEspecifico => {
    if (showActivos && objetivoEspecifico.clasificacion === 1) return true;
    if (showInactivos && objetivoEspecifico.clasificacion === 2) return true;
    return false;
  });

  //FILTRO: BÚSQUEDA
  const objetivosEspecificosBusqueda = objetivosEspecificosFiltrados.filter((objetivoEspecifico: ObjetivoEspecifico) => {
    const textoBusqueda = busqueda.toLowerCase();
    const titulo = objetivoEspecifico.titulo?.toLowerCase() ?? "";
    const estado = estadosMap[objetivoEspecifico.estado]?.toLowerCase() ?? "";
    const descripcion = objetivoEspecifico.descripcion?.toLowerCase() ?? "";
    const autor_creacion = objetivoEspecifico.autor_creacion?.toLowerCase() ?? "";
    const fecha_creacion = objetivoEspecifico.fecha_creacion?.toLowerCase() ?? "";
    const autor_modificacion = objetivoEspecifico.autor_modificacion?.toLowerCase() ?? "";
    const fecha_modificacion = objetivoEspecifico.fecha_modificacion?.toLowerCase() ?? "";
    const clasificacion = clasificacionMap[objetivoEspecifico.clasificacion]?.toLowerCase() ?? "";
    return (
      titulo.includes(textoBusqueda) ||
      estado.includes(textoBusqueda) ||
      descripcion.includes(textoBusqueda) ||
      autor_creacion.includes(textoBusqueda) ||
      fecha_creacion.includes(textoBusqueda) ||
      autor_modificacion.includes(textoBusqueda) ||
      fecha_modificacion.includes(textoBusqueda) ||
      clasificacion.includes(textoBusqueda)
    );
  });
  
  //VISTA
  return (
    <CustomModal visible={visible} onClose={onClose} tipo={"-y"}>
      <View className="flex-1">
        <Titulo
          subtitulo={"Objetivos específicos"}
          onPressRecargar={fetchObjetivosEspecificos}
          onBusquedaChange={setBusqueda}
        >
          Plan de trabajo
        </Titulo>
        {isLoading ? (
          <IndicadorCarga />
        ) : error ? (
          <MensajeVacio
            mensaje={`Hubo un error al cargar los objetivos específicos.\nIntenta nuevamente.`}
            onPressRecargar={fetchObjetivosEspecificos}
          />
        ) : objetivosEspecificos.length === 0 ? (
          <MensajeVacio
            mensaje={
              isProfesional
                ? `El objetivo general aún no tiene objetivos específicos.\n¡Comienza a planificar el trabajo del paciente usando el botón ＋!`
                : `El objetivo general aún no tiene objetivos específicos.\n¡Revisa aquí cuando los profesionales los planifiquen!`
            }
          />
        ) : (
          <>
            <FiltroActivoInactivo
              filtros={[{
                          label: "Mostrar activos",
                          value: "activos",
                          checked: showActivos,
                          onToggle: () => setShowActivos(!showActivos),
                        },
                        {
                          label: "Mostrar inactivos",
                          value: "inactivos",
                          checked: showInactivos,
                          onToggle: () => setShowInactivos(!showInactivos),
                        }]}
            />
            {objetivosEspecificosBusqueda.length === 0 ? (
              <MensajeVacio
                mensaje={
                  showActivos && showInactivos ? `No se encontraron objetivos específicos. ${isProfesional ? "¡Comienza a planificar el trabajo del paciente usando el botón ＋!" : "¡Revisa aquí cuando los profesionales los planifiquen!"}` :
                  showActivos && !showInactivos ? `No se encontraron objetivos específicos nuevos o activos. ${isProfesional ? "¡Comienza a planificar el trabajo del paciente usando el botón ＋!" : "¡Revisa aquí cuando los profesionales los planifiquen!"}` :
                  !showActivos && showInactivos ? `No se encontraron objetivos específicos inactivos. ${isProfesional ? "¡Comienza a planificar el trabajo del paciente usando el botón ＋!" : "¡Revisa aquí cuando los profesionales los planifiquen!"}` :
                  `Selecciona al menos un filtro para mostrar objetivos específicos.`
                }
              />
              ) : (
                <ObjetivosEspecificosLista
                  objetivosEspecificos={objetivosEspecificosBusqueda}
                  onChange={fetchObjetivosEspecificos}
                />
            )}
          </>
        )}
        {isProfesional ? <BotonAgregar onPress={handleAgregarObjetivoEspecifico}/> : null}
      </View>
    </CustomModal>
  );
}