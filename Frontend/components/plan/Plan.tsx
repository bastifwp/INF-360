import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/auth";
import { BotonAgregar } from "@/components/Boton";
import { TituloRecargar } from "@/components/Titulo";
import { MensajeVacio } from "@/components//MensajeVacio";
import { IndicadorCarga } from "@/components/IndicadorCarga";
import { ListaObjetivos } from "@/components/plan/ListaObjetivos";

import ListaMetas from '@/components/plan/ListaMetas';
import ListaActividades from '@/components/plan/ListaActividades';

const metas = [{
    id: "1",
    titulo: "Reconoce vocales",
    estado: "Logrado",
    color: "#306e21"
},
{
    id: "2",
    titulo: "Pronuncia la letra R correctamente",
    estado: "Medianamente Logrado",
    color: "#d1ae00"
}];

const actividades = [{
    id: "1",
    titulo: "Juego de memoria",
    descripcion: "Juego de memoria con cartas que contienen figuras",
    duración: "#306e21"
},
{
    id: "2",
    titulo: "Lectura guiada",
    descripcion: "Tiempo de lectura con ayuda de un profesional",
    duración: "#306e21"
}];

export function Plan() {

  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const router = useRouter();

  const parametros = useLocalSearchParams();
  const recargarObjetivos = parametros.recargarObjetivos;
  const paciente = parametros.paciente;
  const [pacienteID, pacienteEncodedNombre] = paciente?.split("-") ?? [null, null];

  const pathname = usePathname();
  const isProfesional = pathname.includes("/profesional");

  const datosObjetivosAlmacenamiento = `plan_objetivos_${pacienteID}`;
  const fechaObjetivosAlmacenamiento = `plan_objetivos_${pacienteID}_fecha`;

  //ESTADOS
  const [pestanaActiva, setPestanaActiva] = useState<'objetivos' | 'metas' | 'actividades'>('objetivos')
  const [objetivos, setObjetivos] = useState([]);
  const [isLoadingObjetivos, setIsLoadingObjetivos] = useState(true);
  const [errorObjetivos, setErrorObjetivos] = useState(false);

  const recargarNuevoObjetivo = useRef(recargarObjetivos === "1");

  useEffect(() => {  
    fetchObjetivos();
  },[authToken, refreshToken]);
  
  const fetchObjetivos = async (forzarRecargar = false) => {
    if (!authToken || !refreshToken) return;
    setIsLoadingObjetivos(true);
    try {
      const ahora = Date.now();
      const cacheFechaObjetivosAlmacenamiento = await AsyncStorage.getItem(fechaObjetivosAlmacenamiento);
      const cacheDatosObjetivosAlmacenamiento = await AsyncStorage.getItem(datosObjetivosAlmacenamiento);
      const tiempo = 5 * 60 * 1000;
      if (cacheFechaObjetivosAlmacenamiento && cacheDatosObjetivosAlmacenamiento && !recargarNuevoObjetivo.current && !forzarRecargar) {
        const cacheFecha = parseInt(cacheFechaObjetivosAlmacenamiento, 10);
        if (ahora - cacheFecha < tiempo ) {
          console.log("[plan] Obteniendo objetivos del almacenamiento local...");
          setObjetivos(JSON.parse(cacheDatosObjetivosAlmacenamiento));
          setIsLoadingObjetivos(false);
          setErrorObjetivos(false);
          return;
        }
      }
      //SIN CACHÉ VÁLIDO
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[plan] Obteniendo objetivos de la base de datos...");
      const res = await api.get("/objetivos/" + pacienteID + "/")
      setObjetivos(res.data);
      setIsLoadingObjetivos(false);
      setErrorObjetivos(false);
      await AsyncStorage.setItem(datosObjetivosAlmacenamiento, JSON.stringify(res.data));
      await AsyncStorage.setItem(fechaObjetivosAlmacenamiento, ahora.toString());
      if (recargarNuevoObjetivo.current) {
        recargarNuevoObjetivo.current = false;
      }
    } catch (err) {
        console.log("[plan] Error:", err);
        setIsLoadingObjetivos(false);
        setErrorObjetivos(true);
    };
  };

  //HANDLE: AGREGAR-OBJETIVO
  const handleAgregarObjetivo = () => {
    console.log("[plan] Agregando objetivo...")
    router.push(`/profesional/${paciente}/plan/objetivo-agregar`);
  }

  return (

    <View className="flex-1">

      <TituloRecargar onPress={() => fetchObjetivos(true)}>
        Plan de trabajo
      </TituloRecargar>

      {/* Barra de pestañas */}
      <View className="flex-row mb-4">
        {['objetivos', 'metas', 'actividades'].map(pestana => (
          <TouchableOpacity
            key={pestana}
            onPress={() => setPestanaActiva(pestana as any)}
            className={`flex-1 py-3 mx-1 rounded-lg ${
              pestanaActiva === pestana ? 'bg-primary' : 'bg-lightgrey'
            }`}
          >
            <Text
              className={`text-center ${
                pestanaActiva === pestana ? 'text-white font-bold' : 'text-black'
              } capitalize`}
            >
              {pestana}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido según pestaña */}
      <View className="flex-1">
        
        {/* Objetivos */}
        {pestanaActiva === 'objetivos' && (
          <>
            {isLoadingObjetivos ? (
              <IndicadorCarga/>
            ) : errorObjetivos ? (
              <MensajeVacio
                mensaje={`Hubo un error al cargar los objetivos.`}
                recargar={true}
                onPress={() => fetchObjetivos(true)}
              />
            )
            : objetivos.length === 0 ? (
              <MensajeVacio
                mensaje={
                  isProfesional
                    ? `Sin objetivos por ahora.\n¡Comienza a planificar el trabajo del paciente usando el botón ＋!`
                    : `Sin objetivos por ahora.\n¡Revisa aquí cuando los profesionales los planifiquen!`}/>
            ) : (
              <ListaObjetivos
                objetivos={objetivos}
                onChange={() => fetchObjetivos(true)}
              />
            )}
            {isProfesional ? <BotonAgregar onPress={handleAgregarObjetivo}/> : null}
          </>
        )}

        {/* Metas */}
        {pestanaActiva === 'metas' && (
          <>
            {metas.length === 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-lg text-gray-500">
                  Aún no tienes metas en tu plan de trabajo.
                </Text>
              </View>
            ) : (
              <ListaMetas metas={metas} onChange={() => fetchObjetivos(true)}/>
            )}
          </>
        )}

        {/* Actividades */}
        {pestanaActiva === 'actividades' && (
          <>
            {actividades.length === 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-lg text-gray-500">
                  Aún no tienes actividades en tu plan de trabajo.
                </Text>
              </View>
            ) : (
              <ListaActividades actividades={actividades} onChange={() => fetchObjetivos(true)}/>
            )}
          </>
        )}

      </View>

    </View>
  )
}