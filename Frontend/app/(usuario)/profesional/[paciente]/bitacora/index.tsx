import { FlatList, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/auth";
import { colores } from "@/constants/colores";
import { Etiqueta } from "@/components/Etiqueta";
import { BotonAgregar } from "@/components/Boton";
import { IconoEntrada } from "@/components/Icono";
import { TarjetaExpandido } from "@/components/Tarjeta";
import { MensajeVacio } from "@/components/MensajeVacio";
import { IndicadorCarga } from "@/components/IndicadorCarga";
import { TituloRecargar, TituloSeccion } from "@/components/Titulo";

const animos = [
  { id: "happy", emoji: "😊", nombre: "Feliz" },
  { id: "neutral", emoji: "😐", nombre: "Neutral" },
  { id: "sad", emoji: "😢", nombre: "Triste" },
  { id: "angry", emoji: "😡", nombre: "Molesto" },
  { id: "excited", emoji: "🤩", nombre: "Entusiasmado" },
  { id: "tired", emoji: "🥱", nombre: "Cansado" },
  { id: "confused", emoji: "😕", nombre: "Confundido" },
  { id: "surprised", emoji: "😮", nombre: "Sorprendido" },
];

const categoriaColores = {
  Comunicación: '#4f83cc', // Azul
  Motricidad: '#81c784',   // Verde
  Cognición: '#f48fb1',    // Rosado
  Conducta: '#ffb74d',     // Naranjo
  default: '#b0bec5',      // Gris
};

//ITEM: ENTRADA
const EntradaItem = ({ entrada }) => {
  const getObjetivoColor = (categoria?: string) => {
    if (!categoria) {
      return categoriaColores.default;
    }
    return categoriaColores[categoria] || categoriaColores.default;
  };
  const getAnimoEmoji = (id?: string) => {
    const found = animos.find(a => a.id === id);
    return found ? found.emoji : "🙂";
  };
  const getAnimoNombre = (id?: string) => {
    const found = animos.find(a => a.id === id);
    return found ? found.nombre : "Desconocido";
  };
  const animoID = "happy"; //MOCKUP -> REEMPLAZAR
  const animoEmoji = getAnimoEmoji(animoID);
  const animoNombre = getAnimoNombre(animoID);
  return (
    <TarjetaExpandido
      titulo={entrada.titulo}
      subtitulo={[
        `Fecha: ${entrada.fecha}`,
        `Autor: ${entrada.autor}`,
      ]}
      icono={
        <IconoEntrada
          colores={entrada.selected_obj?.length
            ? entrada.selected_obj.map(obj => getObjetivoColor(obj.categoria))
            : [categoriaColores.default]
          }
          emoji={animoEmoji}
        />
      }
      expandidoContenido={
        <>
          <View className="bg-light rounded-lg p-2 my-2">
            <Text className="text-black">{entrada.comentarios}</Text>
          </View>
          <View>
            <TituloSeccion children={"Estado de ánimo:"} />
            <Etiqueta
              texto={`${animoEmoji} ${animoNombre}`}
              colorFondo={colores.primary}
              colorTexto={colores.white}
            />
          </View>
          {entrada.selected_obj.length === 0 
            ? null
            : (<View>
                <TituloSeccion children={"Objetivos trabajados:"} />
                {entrada.selected_obj?.map((item, index) => (
                  <Etiqueta
                    key={index}
                    texto={item.titulo}
                    colorFondo={getObjetivoColor(item.categoria)}
                  />
                ))}
              </View>)
          }
        </>
      }
    />
  );
};

//LISTA: ENTRADAS
const ListaEntradas = ({ entradas }) => {
  return (
    <FlatList
      data={entradas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EntradaItem entrada={item} />}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};

//BITÁCORA
export default function Bitacora() {

  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const router = useRouter();

  const parametros = useLocalSearchParams();
  const recargar = parametros.recargar;
  const paciente = parametros.paciente;
  const [pacienteID, pacienteEncodedNombre] = paciente?.split("-") ?? [null, null];

  const datosAlmacenamiento = `bitacora_${pacienteID}`;
  const fechaAlmacenamiento = `bitacora_${pacienteID}_fecha`;

  //ESTADOS
  const [entradas, setEntradas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const recargarNuevaEntrada = useRef(recargar === "1");

  useEffect(() => {
    fetchEntradas();
  }, [authToken, refreshToken]);

  const fetchEntradas = async (forzarRecargar = false) => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const ahora = Date.now();
      const cacheFechaAlmacenamiento = await AsyncStorage.getItem(fechaAlmacenamiento);
      const cacheDatosAlmacenamiento = await AsyncStorage.getItem(datosAlmacenamiento);
      const tiempo = 5 * 60 * 1000;
      if (cacheFechaAlmacenamiento && cacheDatosAlmacenamiento && !recargarNuevaEntrada.current && !forzarRecargar) {
        const cacheFecha = parseInt(cacheFechaAlmacenamiento, 10);
        if (ahora - cacheFecha < tiempo ) {
          console.log("[bitácora] Obteniendo entradas del almacenamiento local...");
          setEntradas(JSON.parse(cacheDatosAlmacenamiento));
          setIsLoading(false);
          setError(false);
          return;
        }
      }
      //SIN CACHÉ VÁLIDO
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[bitácora] Obteniendo entradas de la base de datos...");
      const res = await api.get("/bitacora/" + pacienteID + "/");
      setEntradas(res.data);
      setIsLoading(false);
      setError(false);
      await AsyncStorage.setItem(datosAlmacenamiento, JSON.stringify(res.data));
      await AsyncStorage.setItem(fechaAlmacenamiento, ahora.toString());
      if (recargarNuevaEntrada.current) {
        recargarNuevaEntrada.current = false;
      }
    } catch (err) {
      console.log("[bitácora] Error:", err);
      setIsLoading(false);
      setError(true);
    }
  };

  //HANDLE: AGREGAR
  const handleAgregar = () => {
    console.log("[bitácora] Agregando entrada...")
    console.log("[bitácora] Paciente:", paciente);
    router.push(`/profesional/${paciente}/bitacora/entrada-agregar`);
  }

  //VISTA
  return (
    <View className="flex-1">
      <TituloRecargar onPress={() => fetchEntradas(true)}>
        Bitácora
      </TituloRecargar>
      <View className="flex-1">
        {isLoading ? (
          <IndicadorCarga/>
        ) : error ? (
          <MensajeVacio
            mensaje={`Hubo un error al cargar las entradas.`}
            recargar={true}
            onPress={() => fetchEntradas(true)}
          />
        ) : entradas.length === 0 ? (
          <MensajeVacio
            mensaje={`Sin entradas por ahora.\n¡Comienza a registrar el progreso del paciente usando el botón ＋!`}/>
        ) : (
          <ListaEntradas entradas={entradas} />
        )}
      </View>
      <BotonAgregar onPress={handleAgregar}/>
    </View>
  )
  
}