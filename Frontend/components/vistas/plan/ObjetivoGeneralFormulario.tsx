import { Alert, View } from "react-native";
import React, { useEffect, useRef, useState } from "react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { DescartarCambiosContext } from "@/context/DescartarCambios";
import { FormularioCampo, FormularioCampoSelect } from "@/components/base/Entrada";

const categoriasItems = [
  { id: 'Comunicación', titulo: 'Comunicación', color: '#4f83cc' },
  { id: 'Motricidad', titulo: 'Motricidad', color: '#81c784' },
  { id: 'Cognición', titulo: 'Cognición', color: '#f48fb1' },
  { id: 'Conducta', titulo: 'Conducta', color: '#ffb74d' },
];

export function ObjetivoGeneralFormulario() {

  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();
    
  const router = useRouter();

  const navigation = useNavigation();
  
  //id: ID del objetivo
  //Si es agregar, id es undefined
  //Si es editar, id es objetivoGeneral.id
  const { paciente, id } = useLocalSearchParams();
  //Si es agregar, modoEdicion es false
  //Si es editar, modoEdicion es true
  const modoEdicion = !!id; 
  const pacienteString = Array.isArray(paciente) ? paciente[0] : paciente;
  const [pacienteID, pacienteEncodedNombre] = pacienteString?.split("-") ?? [null, null];
    
  //ESTADOS
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [objetivoGeneral, setObjetivoGeneral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBoton, setIsLoadingBoton] = useState(false);

  const datosIniciales = useRef({ titulo: '', descripcion: '', categoria: null });

  useEffect(() => {
    if (modoEdicion) {
      if (!authToken || !refreshToken) return;
      const api = createApi(authToken, refreshToken, setAuthToken);
      api
        .get("/objetivos/detalle/" + id + "/")
        .then((res: any) => {
          const data = res.data;
          setObjetivoGeneral(data);
          setTitulo(data.titulo);
          setDescripcion(data.descripcion);
          setCategoria(data.categoria);
          datosIniciales.current = {
            titulo: data.titulo,
            descripcion: data.descripcion,
            categoria: data.categoria,
          };
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      datosIniciales.current = {
        titulo: '',
        descripcion: '',
        categoria: null,
      };
      setIsLoading(false);
    }
  }, [modoEdicion, id, authToken, refreshToken]);

  const hayCambios = () => {
    return (
      titulo != datosIniciales.current.titulo ||
      descripcion != datosIniciales.current.descripcion ||
      categoria != datosIniciales.current.categoria
    )
  }

  //DESCARTAR CAMBIOS
  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      if (!hayCambios()) {return}
      e.preventDefault();
      Alert.alert(
        "¿Descartar cambios?",
        "Tienes cambios sin guardar. ¿Estás segur@ de que quieres salir?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          }
        ]
      );
    });
    return () => beforeRemoveListener();
  }, [navigation, titulo, descripcion, categoria]);

  //DESCARTAR CAMBIOS
  const handleDescartarCambios = (path) => {
    if (hayCambios()) {
      Alert.alert(
        "¿Descartar cambios?",
        "Tienes cambios sin guardar. ¿Estás segur@ de que quieres salir?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: () => {}
          },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => router.push(path),
          }
        ]
      );
    } else {
      router.push(path);
    }
  };
    
  //HANDLE: GUARDAR
  const handleGuardar = async () => {
    if (!titulo || !categoria || !descripcion) {
      console.log("[plan: objetivo-general-agregar] Error. Por favor, completa todos los campos obligatorios marcados con *...");
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios marcados con *.");
      return;
    }
    setIsLoadingBoton(true);
    try {
      if (!authToken || !refreshToken) return;
      const api = createApi(authToken, refreshToken, setAuthToken);
      if (modoEdicion) {
        console.log("[plan: objetivo-general-agregar] Editando objetivo general:", { pacienteID, titulo, descripcion, categoria });
        {
          const res = await api.put("/objetivos/detalle/" + id + "/", {titulo: titulo,
                                                                       descripcion: descripcion,
                                                                       categoria:  categoria},
                                                                      {timeout: 5000})
          console.log("[plan: objetivo-general-agregar] Respuesta:", res.data);
          Alert.alert(
            "Éxito",
            "Objetivo general guardado correctamente.",
            [{
              text: "OK",
              onPress: () => {router.push(`/profesional/${paciente}/plan?recargar=1`)},
            }]
          )
        }
      } else {
        console.log("[plan: objetivo-general-agregar] Creando objetivo general:", { pacienteID, titulo, descripcion, categoria });
        {
          const res = await api.post("/objetivos/" + pacienteID + "/", {titulo: titulo,
                                                                        descripcion: descripcion,
                                                                        categoria:  categoria},
                                                                       {timeout: 5000})
          console.log("[plan: objetivo-general-agregar] Respuesta:", res.data);
          Alert.alert(
            "Éxito",
            "Objetivo general guardado correctamente.",
            [{
              text: "OK",
              onPress: () => {router.push(`/profesional/${paciente}/plan?recargar=1`)},
            }]
          )
        }
      }
    } catch(err) {
      console.log("[plan: objetivo-general-agregar] Error:", err); 
      Alert.alert(
        "Error",
        modoEdicion
        ? "El objetivo general no pudo ser editado. Intenta nuevamente."
        : "El objetivo general no pudo ser creado. Intenta nuevamente.",
        [{text: "OK"}]
      )
    } finally {
      setIsLoadingBoton(false);
    }
  };
    
  //VISTA
  return (
    <DescartarCambiosContext.Provider value={{ handleDescartarCambios }}>
      <KeyboardAwareScrollView
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, padding: 8 }} 
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <Titulo> 
          {modoEdicion ? "Editar objetivo general" : "Agregar objetivo general"}
        </Titulo>
        {isLoading ? (
          <IndicadorCarga/>
        ) : (
          <View className="gap-2">
            <FormularioCampo
              label={"Título"}
              value={titulo}
              onChangeText={setTitulo}
              placeholder={"Ingresa un título"}
              maxLength={255}
              asterisco={true}
              tipo={2}
            />
            <FormularioCampoSelect
              label={"Categoría"}
              placeholder={"Selecciona una categoría..."}
              items={categoriasItems}
              selectedId={categoria}
              onChange={setCategoria}
              asterisco={true}
              tipo={2}
            />
            <FormularioCampo
              label={"Descripción"}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder={"Ingresa una descripción"}
              multiline
              maxLength={4000}
              asterisco={true}
              tipo={2}
            />
            <Boton
              texto={"Guardar"}
              onPress={handleGuardar}
              isLoading={isLoadingBoton}
              tipo={3}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </DescartarCambiosContext.Provider>
  );
};