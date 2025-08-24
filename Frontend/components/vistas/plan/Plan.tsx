import { Alert, FlatList, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TextoBloque } from "@/components/base/TextoBloque";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { Titulo, TituloSeccion } from "@/components/base/Titulo";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { formatearFechaDDMMYYYY } from "@/components/base/FormatearFecha";
import { TarjetaExpandido, TarjetaSelector } from "@/components/base/Tarjeta";
import { ObjetivosEspecificosModal } from "@/components/vistas/plan/ObjetivosEspecificos";
import { FiltroActivoInactivo, ObjetivoBadge } from "@/components/vistas/plan/Componentes";
import { BotonAgregar, BotonDetalles, BotonEditar, BotonEliminar } from "@/components/base/Boton";

//CATEGORÍA
const categoriaColores = {
  Comunicación: '#4f83cc', // Azul
  Motricidad: '#81c784',   // Verde
  Cognición: '#f48fb1',    // Rosado
  Conducta: '#ffb74d',     // Naranjo
  default: '#b0bec5'       // Gris por defecto
};

//OBJETIVO GENERAL
interface ObjetivoGeneral {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  categoria_color?: string; //Se puede calcular en el Frontend (pre-HDU de crear categorías)
  autor_creacion: string;
  fecha_creacion: string;
  autor_modificacion?: string;
  fecha_modificacion?: string;
  clasificacion: 0 | 1 | 2;
}
const clasificacionMap: Record<number, string> = {
  0: "Nuevo",
  1: "Activo",
  2: "Inactivo",
};

//ICONO: OBJETIVO GENERAL
interface ObjetivoGeneralIconoProps {
  categoria_color: string;
  clasificacion: 0 | 1 | 2;
}
export function ObjetivoGeneralIcono({
  categoria_color,
  clasificacion
}: ObjetivoGeneralIconoProps) {
  return (
    <View className="relative w-[50px] h-[50px]">
      { clasificacion === 2 ? (
        <Ionicons name="ellipse" size={50} color={colors.mediumgrey}/>
      ) : (
        <Ionicons name="ellipse" size={50} color={categoria_color}/>
      )}
    </View>
  )
}

//ÍTEM: OBJETIVO GENERAL
interface ObjetivoGeneralItemProps {
  objetivoGeneral: ObjetivoGeneral;
  onChange: () => void;
}
const ObjetivoGeneralItem = ({ objetivoGeneral, onChange }: ObjetivoGeneralItemProps) => {

  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  const isProfesional = user?.role === "profesional";

  const router = useRouter();
  
  const { paciente } = useLocalSearchParams();

  //OBJETIVO GENERAL
  objetivoGeneral.categoria_color = categoriaColores[objetivoGeneral.categoria as keyof typeof categoriaColores] || categoriaColores.default;

  //ESTADOS
  const [showObjetivosEspecificos, setShowObjetivosEspecificos] = useState(false);

  //HANDLE: OBJETIVOS ESPECÍFICOS
  const handleObjetivosEspecificos = (visible: boolean) => {
    setShowObjetivosEspecificos(visible)
  };

  //HANDLE: EDITAR
  const handleEditar = () => {
    router.push(`/profesional/${paciente}/plan/objetivo-general-agregar?id=${objetivoGeneral.id}`);
  };

  //HANDLE: ELIMINAR
  const handleEliminar = () => {
    Alert.alert(
      "Eliminar objetivo general",
      `¿Estás segur@ que quieres eliminar "${objetivoGeneral.titulo}"? ¡Se perderá información sobre el progreso del paciente!`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => {console.log("[plan] Eliminando objetivo general:", objetivoGeneral.id);
          {
            if (!authToken || !refreshToken) return;
            const api = createApi(authToken, refreshToken, setAuthToken);
            api
              .delete("/objetivos/detalle/" + objetivoGeneral.id + "/", {timeout:5000})
              .then((res: any) => {console.log("[plan] Respuesta:", res.status);
                            onChange()})
              .catch((err: any) => {if (!err.request){console.log("[plan] Error:", err.message);}
                            onChange();
              });
          } 
        }, style: "destructive" },
      ]
    );
  };

  //VISTA
  return (
    <View className="relative">
      {objetivoGeneral.clasificacion === 0 && (
        <ObjetivoBadge
          fondoColor={colors.primary}
          texto={"Nuevo"}
          textoColor={colors.white}
        />
      )}
      <TarjetaExpandido
        tarjetaEstilo={objetivoGeneral.clasificacion === 2 ? "bg-lightgrey p-4 mb-4 opacity-50" : "bg-lightgrey p-4 mb-4"}
        titulo={objetivoGeneral.titulo}
        subtitulo={[`Categoría: ${objetivoGeneral.categoria}`]}
        icono={<ObjetivoGeneralIcono categoria_color={objetivoGeneral.categoria_color} clasificacion={objetivoGeneral.clasificacion}/>}
        expandidoContenido={
          <View className="gap-4">
            {objetivoGeneral.descripcion && objetivoGeneral.descripcion.length > 0 && (<TextoBloque texto={objetivoGeneral.descripcion}/>)}
            <View className="gap-2">
              <TituloSeccion children={"Opciones:"}/>
              <View className="gap-2">
                <TarjetaSelector
                  titulo={"Ver objetivos específicos"}
                  onPress={() => handleObjetivosEspecificos(true)}
                  icono={<Ionicons name={"list-circle"} size={24} color={colors.white}/>}
                  iconoColor={colors.white}
                  tarjetaEstilo={"bg-primary p-2"}
                  tituloEstilo={"text-white text-base font-semibold"}
                />
                <View className="flex-row flex-wrap justify-between gap-1" style={{ flexShrink: 1 }}>
                  {isProfesional ? (
                    <>
                      <BotonEditar texto={"Editar"} onPress={handleEditar} />
                      {objetivoGeneral.clasificacion === 0 || objetivoGeneral.clasificacion == 2 ? (
                        <BotonEliminar texto={"Eliminar"} onPress={handleEliminar} />
                      ) : null}
                    </>
                  ) : null}
                  <BotonDetalles>
                    <View className="gap-1">
                      <TituloSeccion
                        children={"Autor:"}
                        respuesta={`${objetivoGeneral.autor_creacion} (${formatearFechaDDMMYYYY(objetivoGeneral.fecha_creacion)})`}
                      />
                      {objetivoGeneral.autor_modificacion && objetivoGeneral.fecha_modificacion && (
                        <TituloSeccion
                          children={"Última modificación:"}
                          respuesta={`${objetivoGeneral.autor_modificacion} (${formatearFechaDDMMYYYY(objetivoGeneral.fecha_modificacion)})`}
                        />
                      )}
                      <TituloSeccion
                        children={"Clasificación:"}
                        respuesta={clasificacionMap[objetivoGeneral.clasificacion]}
                      />
                    </View>
                  </BotonDetalles>
                </View>
              </View>
            </View>
          </View>
        }
      />
      <ObjetivosEspecificosModal
        visible={showObjetivosEspecificos}
        onClose={() => handleObjetivosEspecificos(false)}
        objetivoGeneralID={objetivoGeneral.id}
      />
    </View>
  );
};

//LISTA: OBJETIVOS GENERAL
interface ObjetivosGeneralesListaProps {
  objetivosGenerales: ObjetivoGeneral[];
  onChange: () => void;
}
export function ObjetivosGeneralesLista({ objetivosGenerales, onChange }: ObjetivosGeneralesListaProps) {
  return (
    <FlatList
      data={objetivosGenerales}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ObjetivoGeneralItem objetivoGeneral={item} onChange={onChange} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};

//VISTA: PLAN
export function Plan() {

  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  const isProfesional = user?.role === "profesional";

  const router = useRouter();

  const parametros = useLocalSearchParams();
  const recargar = parametros.recargar;
  const paciente = parametros.paciente;
  const pacienteString = Array.isArray(paciente) ? paciente[0] : paciente;
  const [pacienteID, pacienteEncodedNombre] = pacienteString?.split("-") ?? [null, null];

  const datosObjetivosGeneralesAlmacenamiento = `plan_objetivos_general_${pacienteID}`;
  const fechaObjetivosGeneralesAlmacenamiento = `plan_objetivos_general_${pacienteID}_fecha`;

  //ESTADOS
  const [objetivosGenerales, setObjetivosGenerales] = useState<ObjetivoGeneral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showActivos, setShowActivos] = useState(true);
  const [showInactivos, setShowInactivos] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const recargarObjetivosGenerales = useRef(recargar === "1");

  useEffect(() => {  
    fetchObjetivosGenerales();
  },[authToken, refreshToken]);
  
  //FETCH: OBJETIVOS GENERALES
  const fetchObjetivosGenerales = async (recargarForzar = false) => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const ahora = Date.now();
      const cachefechaObjetivosGeneralesAlmacenamiento = await AsyncStorage.getItem(fechaObjetivosGeneralesAlmacenamiento);
      const cachedatosObjetivosGeneralesAlmacenamiento = await AsyncStorage.getItem(datosObjetivosGeneralesAlmacenamiento);
      const tiempo = 5 * 60 * 1000;
      if (cachefechaObjetivosGeneralesAlmacenamiento && cachedatosObjetivosGeneralesAlmacenamiento && !recargarObjetivosGenerales.current && !recargarForzar) {
        const cacheFecha = parseInt(cachefechaObjetivosGeneralesAlmacenamiento, 10);
        if (ahora - cacheFecha < tiempo ) {
          console.log("[plan] Obteniendo objetivos generales del almacenamiento local...");
          setObjetivosGenerales(JSON.parse(cachedatosObjetivosGeneralesAlmacenamiento));
          setIsLoading(false);
          setError(false);
          return;
        }
      }
      //SIN CACHÉ VÁLIDO
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[plan] Obteniendo objetivos generales de la base de datos...");
      const res = await api.get("/objetivos/" + pacienteID + "/");
      const objetivosGeneralesConClasificacion = res.data.map((objetivoGeneral: ObjetivoGeneral) => ({ ...objetivoGeneral, clasificacion: Math.floor(Math.random() * 3)})); //BORRAR
      setObjetivosGenerales(objetivosGeneralesConClasificacion); //MODIFICAR
      setIsLoading(false);
      setError(false);
      await AsyncStorage.setItem(datosObjetivosGeneralesAlmacenamiento, JSON.stringify(res.data));
      await AsyncStorage.setItem(fechaObjetivosGeneralesAlmacenamiento, ahora.toString());
      if (recargarObjetivosGenerales.current) {
        recargarObjetivosGenerales.current = false;
      }
    } catch (err) {
      console.log("[plan] Error:", err);
      setIsLoading(false);
      setError(true);
    };
  };

  //HANDLE: AGREGAR-OBJETIVO-GENERAL
  const handleAgregarObjetivoGeneral = () => {
    console.log("[plan] Agregando objetivo general...")
    router.push(`/profesional/${paciente}/plan/objetivo-general-agregar`);
  }

  //FILTRO: CLASIFICACIÓN
  const objetivosGeneralesFiltrados = objetivosGenerales.filter(objetivoGeneral => {
    if (showActivos && (objetivoGeneral.clasificacion === 1 || objetivoGeneral.clasificacion === 0)) return true;
    if (showInactivos && objetivoGeneral.clasificacion === 2) return true;
    return false;
  });

  //FILTRO: BÚSQUEDA
  const objetivosGeneralesBusqueda = objetivosGeneralesFiltrados.filter((objetivoGeneral: ObjetivoGeneral) => {
    const textoBusqueda = busqueda.toLowerCase();
    const titulo = objetivoGeneral.titulo?.toLowerCase() ?? "";
    const categoria = objetivoGeneral.categoria?.toLowerCase() ?? "";
    const descripcion = objetivoGeneral.descripcion?.toLowerCase() ?? "";
    const autor_creacion = objetivoGeneral.autor_creacion?.toLowerCase() ?? "";
    const fecha_creacion = objetivoGeneral.fecha_creacion?.toLowerCase() ?? "";
    const autor_modificacion = objetivoGeneral.autor_modificacion?.toLowerCase() ?? "";
    const fecha_modificacion = objetivoGeneral.fecha_modificacion?.toLowerCase() ?? "";
    const clasificacion = objetivoGeneral.fecha_modificacion?.toLowerCase() ?? "";
    return (
      titulo.includes(textoBusqueda) ||
      categoria.includes(textoBusqueda) ||
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
    <View className="flex-1">
      <Titulo
        subtitulo={"Objetivos generales"}
        onPressRecargar={() => fetchObjetivosGenerales(true)}
        onBusquedaChange={setBusqueda}
      >
        Plan de trabajo
      </Titulo>
      {isLoading ? (
        <IndicadorCarga/>
      ) : error ? (
        <MensajeVacio
          mensaje={`Hubo un error al cargar los objetivos generales.\nIntenta nuevamente.`}
          onPressRecargar={() => fetchObjetivosGenerales(true)}
        />
      ) : objetivosGenerales.length === 0 ? (
        <MensajeVacio
          mensaje={
            isProfesional
              ? `Aún no tienes objetivos generales.\n¡Comienza a planificar el trabajo del paciente usando el botón ＋!`
              : `Aún no tienes objetivos generales.\n¡Revisa aquí cuando los profesionales los planifiquen!`}/>
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
          {objetivosGeneralesBusqueda.length === 0 ? (
            <MensajeVacio
              mensaje={
                showActivos && showInactivos ? `No se encontraron objetivos generales. ${isProfesional ? "¡Comienza a planificar el trabajo del paciente usando el botón ＋!" : "¡Revisa aquí cuando los profesionales los planifiquen!"}` :
                showActivos && !showInactivos ? `No se encontraron objetivos generales nuevos o activos. ${isProfesional ? "¡Comienza a planificar el trabajo del paciente usando el botón ＋!" : "¡Revisa aquí cuando los profesionales los planifiquen!"}` :
                !showActivos && showInactivos ? `No se encontraron objetivos generales inactivos. ${isProfesional ? "¡Comienza a planificar el trabajo del paciente usando el botón ＋!" : "¡Revisa aquí cuando los profesionales los planifiquen!"}` :
                `Selecciona al menos un filtro para mostrar objetivos generales.`
              }
            />
          ) : (
            <ObjetivosGeneralesLista
              objetivosGenerales={objetivosGeneralesBusqueda}
              onChange={() => fetchObjetivosGenerales(true)}
            />
          )}
        </>
      )}
      {isProfesional ? <BotonAgregar onPress={handleAgregarObjetivoGeneral}/> : null}
    </View>
  )
}