import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { DescartarCambiosContext } from "@/context/DescartarCambios";
import { FormularioCampo, FormularioCampoLabel, FormularioCampoMultiSelect } from "@/components/base/Entrada";

//ACÁ TENGO UN PROBLEMA PORQUE PARECE QUE ALGUNOS IDS SON INTEGER Y OTROS SON STRINGS

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
interface FormularioCampoAnimoProps {
  label: string;
  asterisco: boolean;
  tipo: number;
  value?: Animo;
  onChange: (selected: Animo) => void;
}
export function FormularioCampoAnimo({ label, asterisco, tipo, value, onChange }: FormularioCampoAnimoProps) {
  return (
    <View className="w-full mb-2">
      <FormularioCampoLabel label={label} asterisco={asterisco} tipo={tipo}/>
      {value 
        ? (<Text className="text-primary font-bold mb-4 text-center">{value.emoji} {value.nombre}</Text>)
        : (<Text className="text-mediumdarkgrey mb-4 text-center">Selecciona un estado de ánimo</Text>)
      }
      <View className="gap-2 flex-row justify-center flex-wrap">
        {animos.map((item) => {
          const seleccionado = value?.id === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onChange(item)}
              className="rounded-full p-4 w-16 h-16 justify-center items-center"
              style={{backgroundColor: seleccionado ? colors.primary : colors.lightgrey}}
            >
              <Text className="text-2xl">{item.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

//ACTIVIDAD
interface Actividad {
  id: string;
  titulo: string;
}
const mockActividades = [
  { id: "1", titulo: "Escuchar música" },
  { id: "2", titulo: "Hacer dibujo" },
  { id: "3", titulo: "Ejercicios de motricidad fina" },
  { id: "4", titulo: "Leer cuento" },
  { id: "5", titulo: "Juego de roles" },
  { id: "6", titulo: "Ejercicios de respiración" },
];

//ENTRADA-AGREGAR
export default function EntradaAgregar() {

  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();

  const router = useRouter();
  
  const navigation = useNavigation();

  const { paciente } = useLocalSearchParams();
  const pacienteString = Array.isArray(paciente) ? paciente[0] : paciente;
  const [pacienteID, pacienteEncodedNombre] = pacienteString?.split("-") ?? [null, null];

  //ESTADOS
  const [titulo, setTitulo] = useState("");
  const [animo, setAnimo] = useState<Animo | undefined>(undefined);
  const [objetivosEspecificos, setObjetivosEspecificos] = useState([]);
  const [selected_obj, setSelected_obj] = useState<number[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState<string[]>([]);
  const [comentarios, setComentarios] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBoton, setIsLoadingBoton] = useState(false);

  useEffect(() => {
    fetchObjetivosEspecificos();
    fetchActividades();
  },[authToken, refreshToken]);

  useEffect(() => {
    if (!isLoading && objetivosEspecificos.length === 0) {
      Alert.alert(
        "Aviso",
        "No se encontraron objetivos específicos. Para crear una entrada, primero debes tener al menos un objetivo específico registrado.",
        [{
          text: "Ir al plan de trabajo",
          onPress: () => {router.push(`/profesional/${paciente}/plan?recargar=1`)}
        }],
        { cancelable: false }
      )
    }
  }, [objetivosEspecificos])

  //FETCH: OBJETIVOS ESPECÍFICOS (VINCULADOS AL PROFESIONAL)
  const fetchObjetivosEspecificos = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[bitácora: entrada-agregar] Obteniendo objetivos específicos...");
      const res = await api.get("/objetivos/" + pacienteID + "/");
      setObjetivosEspecificos(res.data);
      setIsLoading(false);
      setError(false);
    } catch(err) {
      console.log("[bitácora: entrada-agregar] Error:", err);
      setIsLoading(false);
      setError(true);
    }
  };

  //FETCH: ACTIVIDADES
  const fetchActividades = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[actividades] Obteniendo actividades de la base de datos...");
      //const res = await api.get("/objetivos/" + pacienteID + "/");
      setActividades(mockActividades);
      setIsLoading(false);
      setError(false);
    } catch (err) {
      console.log("[actividades] Error:", err);
      setIsLoading(false);
      setError(true);
    };
  }
  
  const datosIniciales = useRef({
    titulo: "",
    animo: null,
    selected_obj: {},
    actividadesSeleccionadas: {},
    comentarios: "",
  });

  useEffect(() => {
    datosIniciales.current = {
      titulo: "",
      animo: null,
      selected_obj: {},
      actividadesSeleccionadas: {},
      comentarios: '',
    };
  }, []);

  const hayCambios = () => {
    if (titulo !== datosIniciales.current.titulo) return true;
    if (comentarios !== datosIniciales.current.comentarios) return true;
    if (animo !== datosIniciales.current.animo) return true;
    let keys = new Set([
      ...Object.keys(selected_obj),
      ...Object.keys(datosIniciales.current.selected_obj),
    ]);
    for (const k of keys) {
      if (!!selected_obj[k] !== !!datosIniciales.current.selected_obj[k]) return true;
    }
    keys = new Set([
      ...Object.keys(actividadesSeleccionadas),
      ...Object.keys(datosIniciales.current.actividadesSeleccionadas),
    ]);
    for (const k of keys) {
      if (!!actividadesSeleccionadas[k] !== !!datosIniciales.current.actividadesSeleccionadas[k]) return true;
    }
    return false;
  };

  //DESCARTAR CAMBIOS
  useEffect(() => {
    const beforeRemoveListener = navigation.addListener("beforeRemove", (e) => {
      if (!hayCambios()) return;
      e.preventDefault();
      Alert.alert(
        "¿Descartar cambios?",
        "Tienes cambios sin guardar. ¿Estás segur@ de que quieres salir?",
        [
          { text: "No", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return beforeRemoveListener;
  }, [navigation, titulo, animo, selected_obj, actividadesSeleccionadas, comentarios]);

  //HANDLE: DESCARTAR CAMBIOS
  const handleDescartarCambiosEntrada = (path) => {
    if (hayCambios()) {
      Alert.alert(
        "¿Descartar cambios?",
        "Tienes cambios sin guardar. ¿Estás segur@ de que quieres salir?",
        [
          { text: "No", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => router.push(path) },
        ]
      );
    } else {
      router.push(path);
    }
  };

  //HANDLE: GUARDAR
  const handleGuardar = async () => {
    if (!titulo || !animo || selected_obj.length == 0) {
      console.log("[bitácora: entrada-agregar] Error. Por favor, completa todos los campos marcados con *...");
      Alert.alert("Error", "Por favor, completa todos los campos marcados con *.");
      return;
    }
    if (!authToken || !refreshToken) {
      console.log("[bitácora: entrada-agregar] Error. No se pudo autenticar...");
      return;
    }
    console.log("[bitácora: entrada-agregar] Guardar entrada:", {
      titulo,
      comentarios,
      paciente,
      selected_obj
    });
    setIsLoadingBoton(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      const res = await api.post("/bitacora/" + pacienteID + "/", {titulo,
                                                                   comentarios,
                                                                   paciente,
                                                                   selected_obj},
                                                                  {timeout: 2000}) //AGREGAR ANIMO Y ACTIVIDADES
      console.log("[bitácora: entrada-agregar] Respuesta:", res.data);
      Alert.alert(
        "Éxito",
        "Entrada guardada correctamente.",
        [{
          text: "OK",
          onPress: () => {router.push(`/profesional/${paciente}/bitacora?recargar=1`)},
        }]
      )
    } catch(err) {
      console.log("[bitácora: entrada-agregar] Error:", err);
      Alert.alert(
        "Error",
        "La entrada no pudo guardarse. Intenta nuevamente.",
        [{text: "OK"}]
      )
    } finally {
      setIsLoadingBoton(false);
    }
  };

  //HANDLE: AGREGAR ACTIVIDAD
  const handleAgregarActividad = () => { 
    console.log("[bitácora] Agregando actividad...");
  }

  //VISTA
  return (
    <DescartarCambiosContext.Provider value={{ handleDescartarCambiosEntrada }}>
      <KeyboardAwareScrollView
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, padding: 8 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <Titulo>
          Agregar entrada
        </Titulo>
        <View className="flex-1">
          {isLoading ? (
            <IndicadorCarga/>
          ) : error ? (
            <MensajeVacio
              mensaje={`Hubo un error al cargar los objetivos específicos o las actividades.\nIntenta nuevamente.`}
              onPressRecargar={() => {
                fetchObjetivosEspecificos();
                fetchActividades();
              }}
            />
          ) : (
            <View className="gap-2">
              <FormularioCampo
                label={"Título"}
                asterisco={true}
                value={titulo}
                onChangeText={setTitulo}
                placeholder={"Ingresa un título"}
                maxLength={255}
                tipo={2}
              />
              <FormularioCampoAnimo
                label={"Estado de ánimo"}
                asterisco={true}
                value={animo}
                onChange={setAnimo}
                tipo={2}
              />
              <FormularioCampoMultiSelect
                label={"Objetivos específicos trabajados"}
                items={objetivosEspecificos}
                selected={selected_obj}
                onChange={setSelected_obj}
                placeholder={"Toca para seleccionar objetivos específicos..."}
                placeholderSelected={"objetivos específicos seleccionados"}
                asterisco={true}
                tipo={2}
              />
              <FormularioCampoMultiSelect
                label={"Actividades realizadas"}
                items={actividades}
                selected={actividadesSeleccionadas}
                onChange={setActividadesSeleccionadas}
                placeholder={"Toca para seleccionar actividades..."}
                placeholderSelected={"actividades seleccionadas"}
                onAddItem={handleAgregarActividad}
                asterisco={false}
                tipo={2}
              />
              <FormularioCampo
                label={"Comentarios"}
                asterisco={false}
                value={comentarios}
                onChangeText={setComentarios}
                placeholder={"Ingresa comentarios"}
                multiline
                maxLength={4000}
                tipo={2}
              />
              <Boton
                texto={"Guardar"}
                onPress={handleGuardar}
                isLoading={isLoadingBoton}
                tipo={3}
              />
            </View>
          )
        }
        </View>
      </KeyboardAwareScrollView>
    </DescartarCambiosContext.Provider>
  );
  
};