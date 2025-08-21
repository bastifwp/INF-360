import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { TextoBloque } from "@/components/base/TextoBloque";
import { TarjetaExpandido } from "@/components/base/Tarjeta";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { Titulo, TituloSeccion } from "@/components/base/Titulo";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { formatearFechaDDMMYYYY } from "@/components/base/FormatearFecha";
import { BotonAgregar, BotonDetalles, BotonEditar, BotonEliminar } from "@/components/base/Boton";

//ACTIVIDAD
interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_modificacion?: string;
}
const mockActividades = [
  {
    id: "1",
    titulo: "Juego de memoria",
    descripcion: "Juego de memoria con cartas que contienen figuras",
    fecha_creacion: "06/06/06",
  },
  {
    id: "2",
    titulo: "Lectura guiada",
    descripcion: "Tiempo de lectura con ayuda de un profesional",
    fecha_creacion: "06/06/06",
    fecha_modificacion: "07/07/07",
  },
];

//ICONO: ACTIVIDAD
export function ActividadIcono() {
  return (
    <View className="relative w-[50px] h-[50px]">
      <Ionicons name="play-circle" size={50} color={colors.primary}/>
    </View>
  )
}

//ÍTEM: ACTIVIDAD
interface ActividadItemProps {
  actividad: Actividad;
  onChange: () => void;
}
const ActividadItem = ({ actividad, onChange }: ActividadItemProps) => {
  
  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  const isProfesional = user?.role === "profesional";

  const router = useRouter();

  const { paciente } = useLocalSearchParams();
  
  //HANDLE: EDITAR
  const handleEditar = () => {
    router.push(`/profesional/${paciente}/actividades/actividad-agregar?id=${actividad.id}`);
  };

  //HANDLE: ELIMINAR
  const handleEliminar = () => {
    Alert.alert(
      "Eliminar actividad",
      `¿Estás segur@ que quieres eliminar "${actividad.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => {console.log("[plan: actividades] Eliminando actividad", actividad.id);
          {
            if (!authToken || !refreshToken) return;
            const api = createApi(authToken, refreshToken, setAuthToken);
            api
              .delete("/actividades/detalle/" + actividad.id + "/", {timeout:5000})
              .then((res: any) => {console.log("[plan: actividades] Respuesta:", res.status);
                            onChange()})
              .catch((err: any) => {if (!err.request){console.log("[plan: actividades] Error:", err.message);}
                            onChange();
              });
          } 
        }, style: "destructive" },
      ]
    );
  };

  //VISTA
  return (
    <TarjetaExpandido
      titulo={actividad.titulo}
      icono={<ActividadIcono/>}
      expandidoContenido={
        <View className="gap-4">
          {actividad.descripcion && actividad.descripcion.length > 0 && (<TextoBloque texto={actividad.descripcion}/>)}
          <View className="gap-2">
            <TituloSeccion children={"Opciones:"}/>
            <View className="flex-row flex-wrap justify-between gap-2" style={{ flexShrink: 1}}>
              <BotonEditar onPress={handleEditar}/>
              <BotonEliminar onPress={handleEliminar}/>
              <BotonDetalles>
                <View className="gap-1">
                  <TituloSeccion
                    children={"Creado:"}
                    respuesta={`${formatearFechaDDMMYYYY(actividad.fecha_creacion)}`}
                  />
                  {actividad.fecha_modificacion && (
                    <TituloSeccion
                      children={"Última modificación:"}
                      respuesta={`${formatearFechaDDMMYYYY(actividad.fecha_modificacion)}`}
                    />
                  )}
                </View>
              </BotonDetalles>
            </View>
          </View>
        </View>
      }
    />
  );
};

//LISTA: ACTIVIDADES
interface ActividadesListaProps {
  actividades: Actividad[];
  onChange: () => void;
}
export function ActividadesLista({ actividades, onChange }: ActividadesListaProps) {
  return (
    <FlatList
      data={actividades}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ActividadItem actividad={item} onChange={onChange} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};
  
//VISTA: ACTIVIDADES
export default function Actividades() {

  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();

  const { paciente } = useLocalSearchParams();
  
  const router = useRouter();
  
  //ESTADOS
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  
  useEffect(() => {  
    fetchActividades();
  },[authToken, refreshToken]);
    
  //FETCH: ACTIVIDADES
  const fetchActividades = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[actividades] Obteniendo actividades de la base de datos...");
      //const res = await api.get("/objetivos/" + pacienteID + "/")
      setActividades(mockActividades);
      setIsLoading(false);
      setError(false);
    } catch (err) {
      console.log("[actividades] Error:", err);
      setIsLoading(false);
      setError(true);
    };
  };
  
  //HANDLE: AGREGAR-ACTIVIDAD
  const handleAgregarActividad = () => {
    console.log("[actividades] Agregando actividad...")
    router.push(`/profesional/${paciente}/actividades/actividad-agregar`);
  }

  //FILTRO
  const actividadesBusqueda = actividades.filter((actividad) => {
    const textoBusqueda = busqueda.toLowerCase();
    const titulo = actividad.titulo?.toLowerCase() ?? "";
    const descripcion = actividad.descripcion?.toLowerCase() ?? "";
    return (
      titulo.includes(textoBusqueda) ||
      descripcion.includes(textoBusqueda)
    );
  });

  //VISTA
  return (
    <View className="flex-1">
      <Titulo
        onPressRecargar={fetchActividades}
        onBusquedaChange={setBusqueda}
      >
        Actividades
      </Titulo>
      {isLoading ? (
        <IndicadorCarga/>
      ) : error ? (
        <MensajeVacio
          mensaje={`Hubo un error al cargar las actividades.\nIntenta nuevamente.`}
          onPressRecargar={fetchActividades}
        />
      ) : actividades.length === 0 ? (
        <MensajeVacio mensaje={`Aún no tienes actividades.\n¡Comienza a planificar el trabajo del paciente usando el botón ＋!`}/>
      ) : (
        <ActividadesLista
          actividades={actividadesBusqueda}
          onChange={fetchActividades}
        />
      )}
      <BotonAgregar onPress={handleAgregarActividad}/>
    </View>
  )
}