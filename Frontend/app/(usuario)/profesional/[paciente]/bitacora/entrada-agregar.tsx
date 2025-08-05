import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/Boton";
import { Titulo } from "@/components/Titulo";
import { colores } from "@/constants/colores";
import { MensajeVacio } from "@/components/MensajeVacio";
import { IndicadorCarga } from "@/components/IndicadorCarga";
import { FormularioCampo } from "@/components/FormularioCampo";
import { DescartarCambiosContext } from "@/context/DescartarCambios";

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
  Comunicación: '#4f83cc',
  Motricidad: '#81c784',
  Cognición: '#f48fb1',
  Conducta: '#ffb74d',
  default: '#b0bec5',
};

//FORMULARIO: OBJETIVO(S)
export function FormularioCampoMultiSelectObjetivo({ label, items, selected, onChange, placeholder }) {
  //ESTADOS
  const [search, setSearch] = useState('');
  //FILTRAR OBJETIVOS SEGÚN BÚSQUEDA
  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item =>
      item.titulo.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);
  //SELECCIONAR Y DESELECCIONAR ÍTEMS
  const toggleItem = id => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };
  return (
    <View>
      <Text className="font-semibold mb-2">{label}</Text>
      {/*CHIPS*/}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 }}>
        {selected.map(id => {
          const item = items.find(i => i.id === id);
          if (!item) return null;
          const color = categoriaColores[item.categoria] || categoriaColores.default;
          return (
            <View
              key={id}
              style={{
                backgroundColor: color,
                borderRadius: 18,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', marginRight: 6 }}>{item.titulo}</Text>
              <TouchableOpacity onPress={() => toggleItem(id)}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <FormularioCampo
        value={search}
        onChangeText={setSearch}
        placeholder={placeholder}
        tipo={2}
        maxLength={255}
      />
      {/*LISTA*/}
      <ScrollView style={{ maxHeight: 160, marginBottom: 8 }} nestedScrollEnabled={true} persistentScrollbar={true}>
        {filteredItems.map(item => {
            const isSelected = selected.includes(item.id);
            const color = categoriaColores[item.categoria] || categoriaColores.default;
            return (
            <TouchableOpacity
                key={item.id.toString()}
                onPress={() => toggleItem(item.id)}
                style={{
                padding: 12,
                backgroundColor: colores.lightgrey,
                borderWidth: 1,
                borderColor: isSelected ? color : colores.lightgrey,
                borderRadius: 12,
                marginBottom: 6,
                }}
            >
                <Text style={{ color: isSelected ? color : colores.mediumdarkgrey }}>{item.titulo}</Text>
            </TouchableOpacity>
            );
        })}
      </ScrollView>
    </View>
  );
}

//FORMULARIO: ESTADO DE ÁNIMO
export function FormularioCampoAnimo({ value, onChange }) {
  return (
    <View className="w-full mb-2">
      <Text className="text-black font-semibold mb-2">Estado de ánimo</Text>
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
              style={{backgroundColor: seleccionado ? colores.primary : colores.lightgrey}}
            >
              <Text className="text-2xl">{item.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

//ENTRADA-AGREGAR
export default function EntradaAgregar() {

  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const router = useRouter();
  
  const navigation = useNavigation();

  const { paciente } = useLocalSearchParams();
  const [pacienteID, pacienteEncodedNombre] = paciente?.split("-") ?? [null, null];

  //ESTADOS
  const [titulo, setTitulo] = useState('');
  const [selected_obj, setSelected_obj] = useState<number[]>([]);
  const [objetivos, setObjetivos] = useState([]);
  const [animo, setAnimo] = useState(null);
  const [comentarios, setComentarios] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  //CONSULTA A LA BASE DE DATOS
  useEffect(() => {
    fetchObjetivos();
  },[authToken, refreshToken]);

  useEffect(() => {
    if (!isLoading && objetivos.length === 0) {
      Alert.alert(
        "Aviso",
        "No se encontraron objetivos. Para crear una entrada, primero debes tener al menos un objetivo registrado.",
        [{
          text: "Ir al plan de trabajo",
          onPress: () => {router.push(`/profesional/${paciente}/plan?recargar=1`)}
        }],
        { cancelable: false }
      )
    }
  }, [objetivos])

  //FETCH: OBJETIVOS
  const fetchObjetivos = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    const api = createApi(authToken, refreshToken, setAuthToken);
    console.log("[bitácora: entrada-agregar] Obteniendo objetivos...");
    api
      .get("/objetivos/" + pacienteID + "/")
      .then(res => {
        setObjetivos(res.data);
        setIsLoading(false);
        setError(false);
      })
      .catch(err => {
        console.log("[bitácora: entrada-agregar] Error:", err);
        setIsLoading(false);
        setError(true);
      });
  };
  
  const datosIniciales = useRef({
    titulo: '',
    selected_obj: {},
    animo: null,
    comentarios: '',
  });

  useEffect(() => {
    datosIniciales.current = {
      titulo: '',
      selected_obj: {},
      animo: null,
      comentarios: '',
    };
  }, []);

  //DETECTAR CAMBIOS
  const hayCambios = () => {
    if (titulo !== datosIniciales.current.titulo) return true;
    if (comentarios !== datosIniciales.current.comentarios) return true;
    if (animo !== datosIniciales.current.animo) return true;
    const keys = new Set([
      ...Object.keys(selected_obj),
      ...Object.keys(datosIniciales.current.selected_obj),
    ]);
    for (const k of keys) {
      if (!!selected_obj[k] !== !!datosIniciales.current.selected_obj[k]) return true;
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
  }, [navigation, titulo, selected_obj, animo, comentarios]);

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
  const handleGuardar = () => {
    if (!titulo || selected_obj.length == 0 || !animo || !comentarios) {
      console.log("[bitácora: entrada-agregar] Error. Por favor, completa todos los campos requeridos...");
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }
    console.log("[bitácora: entrada-agregar] Guardar entrada:", {
      titulo,
      comentarios,
      paciente,
      selected_obj
    });
    //LLAMADA POST A API
    {
      if (!authToken || !refreshToken) return;
      const api = createApi(authToken, refreshToken, setAuthToken);
      api
          .post("/bitacora/" + pacienteID + "/", {titulo,
                                                  comentarios,
                                                  paciente,
                                                  selected_obj
          }, {timeout: 2000})
          .then(res => {
            console.log("[bitácora: entrada-agregar] Respuesta:", res.data);
            Alert.alert(
              "Éxito",
              "Entrada guardada correctamente.",
              [{
                text: "OK",
                onPress: () => {router.push(`/profesional/${paciente}/bitacora?recargar=1`)},
              }]
            )                 
          })
          .catch(err => {
            console.log("[bitácora: entrada-agregar] Error:", err)
            Alert.alert(
              "Error",
              "La entrada no pudo guardarse. Intente nuevamente.",
              [{text: "OK"}]
            )
          })
    };
    //CASO EN EL QUE NO SE GUARDA EXITOSAMENTE
  };

  //VISTA
  return (
    <DescartarCambiosContext.Provider value={{ handleDescartarCambiosEntrada }}>
      <KeyboardAwareScrollView
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, padding: 8 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <Titulo>Agregar entrada</Titulo>
        <View className="flex-1">
          {isLoading ? (
            <IndicadorCarga/>
          ) : error ? (
            <MensajeVacio
              mensaje={`Hubo un error al cargar los objetivos.`}
              recargar={true}
              onPress={() => fetchObjetivos()}
            />
          ) : (
            <>
              <FormularioCampo
                label="Título"
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ingresa un título"
                tipo={2}
                maxLength={255}
              />
              <FormularioCampoMultiSelectObjetivo
                label={"Objetivos"}
                items={objetivos}
                selected={selected_obj}
                onChange={setSelected_obj}
                placeholder={"Busca o selecciona objetivos..."}
              />
              {objetivos.length === 0 ? (
                <View className="h-10">
                  <MensajeVacio mensaje={`No hay objetivos que mostrar. `} />
                </View>
              ) : null}
              <FormularioCampoAnimo value={animo} onChange={setAnimo} />
              <FormularioCampo
                label="Comentarios"
                value={comentarios}
                onChangeText={setComentarios}
                placeholder="Ingresa comentarios"
                tipo={2}
                multiline
                maxLength={4000}
              />
              <Boton
                texto="Guardar"
                onPress={handleGuardar}
                tipo={3}
              />
            </>
          )
        }
        </View>
      </KeyboardAwareScrollView>
    </DescartarCambiosContext.Provider>
  );
  
};