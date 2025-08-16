import { FlatList, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { Etiqueta } from "@/components/base/Etiqueta";
import { BotonAgregar } from "@/components/base/Boton";
import { TextoBloque } from "@/components/base/TextoBloque";
import { TarjetaExpandido } from "@/components/base/Tarjeta";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { Titulo, TituloSeccion } from "@/components/base/Titulo";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";

//NOTA: ENTRADA DEBERÍA CAMBIARSE A DDMMYYYY, y no YYYYMMDD

//ÁNIMO
interface Animo {
  id: string | number;
  nombre: string;
  emoji: string;
}
const animos = [
  { id: "Feliz", emoji: "😊", nombre: "Feliz" },
  { id: "Triste", emoji: "😢", nombre: "Triste" },
  { id: "Molesto", emoji: "😡", nombre: "Molesto" },
  { id: "Entusiasmado", emoji: "🤩", nombre: "Entusiasmado" },
  { id: "Sorprendido", emoji: "😮", nombre: "Sorprendido" },
  { id: "Confundido", emoji: "😕", nombre: "Confundido" },
  { id: "Cansado", emoji: "🥱", nombre: "Cansado" },
  { id: "Neutral", emoji: "😐", nombre: "Neutral" },
];

//ENTRADA
interface Actividad {
  id: string | number;
  titulo: string;
}
interface ObjetivoEspecifico {
  id: string | number;
  titulo: string;
  estado?: number;
}
interface Entrada {
  id: string | number;
  titulo: string;
  fecha: string;
  autor: string;
  animo: string;
  selected_obj: ObjetivoEspecifico[];
  actividades?: Actividad[];
  comentarios?: string;
}

//ICONO: ENTRADA
interface EntradaIconoProps {
  emoji: string;
}
export function EntradaIcono({ emoji }: EntradaIconoProps) {
  return (
    <View className="w-12 h-12 justify-center items-center">
      <View className="w-12 h-12 rounded-full bg-primary justify-center items-center shadow-md">
        <View className="w-8 h-8 rounded-full bg-white justify-center items-center">
          <Text className="text-xl text-center">{emoji}</Text>
        </View>
      </View>
    </View>
  );
}

//ITEM: ENTRADA
interface EntradaItemProps {
  entrada: Entrada;
}
const EntradaItem = ({ entrada }: EntradaItemProps) => {
  const getAnimoEmoji = (id?: string) => {
    const found = animos.find(a => a.id === id);
    return found ? found.emoji : "🙂";
  };
  const getAnimoNombre = (id?: string) => {
    const found = animos.find(a => a.id === id);
    return found ? found.nombre : "Neutral";
  };
  const animoID = "Neutral"; //MOCKUP -> REEMPLAZAR
  const animoEmoji = getAnimoEmoji(animoID);
  const animoNombre = getAnimoNombre(animoID);
  return (
    <TarjetaExpandido
      titulo={entrada.titulo}
      subtitulo={[
        `Autor: ${entrada.autor}`,
        `Fecha: ${entrada.fecha}`,
      ]}
      icono={<EntradaIcono emoji={animoEmoji}/>}
      expandidoContenido={
        <View className="gap-2">
          {entrada.comentarios && entrada.comentarios.length > 0 && (<TextoBloque texto={entrada.comentarios}/>)}
          {animoEmoji && ( //cambiar animoEmoji por animoID
            <View className="gap-2">
              <TituloSeccion children={"Estado de ánimo:"} />
              <Etiqueta
                texto={`${animoEmoji} ${animoNombre}`}
                fondoColor={colors.primary}
              />
            </View>
          )}
          {entrada.selected_obj.length > 0 && (
            <View className="gap-2">
              <TituloSeccion>Objetivos específicos trabajados:</TituloSeccion>
              <View className="flex-row flex-wrap gap-2">
                {entrada.selected_obj.map((item) => (
                  <View
                    key={item.id}
                    className="bg-primary rounded-full py-2 px-4"
                    style={{ backgroundColor:
                      item.estado === 1 ? colors.mediumgreen :
                      item.estado === 2 ? colors.mediumyellow :
                      item.estado === 3 ? colors.mediumred :
                      colors.primary
                    }}>
                    <Text className="text-white text-base font-semibold">{item.titulo}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {entrada.actividades && entrada.actividades.length > 0 && (
            <View className="gap-2">
              <TituloSeccion>Actividades realizadas:</TituloSeccion>
              <View className="flex-row flex-wrap gap-2">
                {entrada.actividades.map((item) => (
                  <View key={item.id} className="bg-primary rounded-full py-2 px-4">
                    <Text className="text-white font-semibold">{item.titulo}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      }
    />
  );
};

//LISTA: ENTRADAS
interface EntradasListaProps {
  entradas: Entrada[];
}
const EntradasLista = ({ entradas }: EntradasListaProps) => {
  //VISTA
  return (
    <FlatList
      data={entradas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <EntradaItem entrada={item} />}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};

//BITÁCORA
export default function Bitacora() {

  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();

  const router = useRouter();

  const parametros = useLocalSearchParams();
  const recargar = parametros.recargar;
  const paciente = parametros.paciente;
  const pacienteString = Array.isArray(paciente) ? paciente[0] : paciente;
  const [pacienteID, pacienteEncodedNombre] = pacienteString?.split("-") ?? [null, null];

  //ALMACENAMIENTO LOCAL
  const datosAlmacenamiento = `bitacora_${pacienteID}`;
  const fechaAlmacenamiento = `bitacora_${pacienteID}_fecha`;

  //ESTADOS
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const recargarNuevaEntrada = useRef(recargar === "1");

  useEffect(() => {
    fetchEntradas();
  }, [authToken, refreshToken]);

  //FETCH: ENTRADAS
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

  //FILTRO
  const entradasBusqueda = entradas.filter((entrada) => {
    const textoBusqueda = busqueda.toLowerCase();
    const titulo = entrada.titulo?.toLowerCase() ?? "";
    const fecha = entrada.fecha?.toLowerCase() ?? "";
    const autor = entrada.autor?.toLowerCase() ?? "";
    const comentarios = entrada.comentarios?.toLowerCase() ?? "";
    const animo = animos.find(a => a.id === entrada.animo)?.nombre.toLowerCase() ?? "";
    const objetivosEspecificos = entrada.selected_obj
      ?.map(objetivo => objetivo.titulo?.toLowerCase() ?? "")
      .join(" ") ?? "";
    const actividades = entrada.actividades
      ?.map(actividad => actividad.titulo?.toLowerCase() ?? "")
      .join(" ") ?? "";
    return (
      titulo.includes(textoBusqueda) ||
      fecha.includes(textoBusqueda) ||
      autor.includes(textoBusqueda) ||
      comentarios.includes(textoBusqueda) ||
      animo.includes(textoBusqueda) ||
      objetivosEspecificos.includes(textoBusqueda) ||
      actividades.includes(textoBusqueda)
    );
  });

  //VISTA
  return (
    <View className="flex-1">
      <Titulo onPressRecargar={() => fetchEntradas(true)} onBusquedaChange={setBusqueda}>
        Bitácora
      </Titulo>
      <View className="flex-1">
        {isLoading ? (
          <IndicadorCarga/>
        ) : error ? (
          <MensajeVacio
            mensaje={`Hubo un error al cargar las entradas.\nIntenta nuevamente.`}
            onPressRecargar={() => fetchEntradas(true)}
          />
        ) : entradas.length === 0 ? (
          <MensajeVacio
            mensaje={`Aún no tienes entradas.\n¡Comienza a registrar el progreso del paciente usando el botón ＋!`}/>
        ) : (
          <EntradasLista entradas={entradasBusqueda}/>
        )}
      </View>
      <BotonAgregar onPress={handleAgregar}/>
    </View>
  );
  
}