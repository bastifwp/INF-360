import { Alert, View } from "react-native";
import React, { useEffect, useState, useRef } from "react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { FormularioCampo } from "@/components/base/Entrada";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { DescartarCambiosContext } from "@/context/DescartarCambios";

//INTEGRACIÓN:
//Al mandar la solicitud POST o PUT, el estado es un string ("Logrado", "Medianamente logrado", "No logrado")
//Se debería hacer un map para convertirlo al entero correspondiente (no sé si en Frontend o Backend)

export function ObjetivoEspecificoFormulario() {

  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();
    
  const router = useRouter();

  const navigation = useNavigation();
    
  //id: ID del objetivo específico
  //Si es agregar, id es undefined
  //Si es editar, id es objetivo_especifico.id
  const { paciente, id } = useLocalSearchParams();
  //Si es agregar, modoEdicion es false
  //Si es editar, modoEdicion es true
  const modoEdicion = !!id;
  const pacienteString = Array.isArray(paciente) ? paciente[0] : paciente;
  const [pacienteID, pacienteEncodedNombre] = pacienteString?.split("-") ?? [null, null];
    
  //ESTADOS
  const [objetivoEspecifico, setObjetivoEspecifico] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false); //CAMBIAR
  const [isLoadingBoton, setIsLoadingBoton] = useState(false);

  const datosIniciales = useRef({ titulo: "", estado: "", descripcion: "" });

  /*
  useEffect(() => {
    if (modoEdicion) {
      if (!authToken || !refreshToken) return;
      const api = createApi(authToken, refreshToken, setAuthToken);
      api
        .get("/objetivos/detalle/" + id + "/") //CAMBIAR RUTA
        .then(res => {
          const data = res.data;
          setObjetivoEspecifico(data);
          setTitulo(data.titulo);
          setEstado(data.estado);
          setDescripcion(data.descripcion);
          datosIniciales.current = {
            titulo: data.titulo,
            estado: data.estado,
            descripcion: data.descripcion,
          };
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      datosIniciales.current = {
        titulo: "",
        estado: "",
        descripcion: "",
      };
      setIsLoading(false);
    }
  }, [modoEdicion, id, authToken, refreshToken]);
  */

  const hayCambios = () => {
    return (
      titulo != datosIniciales.current.titulo ||
      estado != datosIniciales.current.estado ||
      descripcion != datosIniciales.current.descripcion
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
  }, [navigation, titulo, estado, descripcion]);

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
    if (!titulo || !estado) {
      console.log("[plan: objetivo-especifico-agregar] Error. Por favor, completa todos los campos obligatorios marcados con *...");
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios marcados con *.");
      return;
    }
    /*
    setIsLoadingBoton(true);
    try {
      if (!authToken || !refreshToken) return;
      const api = createApi(authToken, refreshToken, setAuthToken);
      if (modoEdicion) {
        console.log("[plan: objetivo-especifico-agregar] Editando objetivo específico:", { pacienteID, titulo, estado, descripcion });
        {
          const res = await api.put("/objetivos/detalle/" + id + "/", {titulo: titulo,
                                                                       estado: estado,
                                                                       descripcion: descripcion},
                                                                      {timeout: 5000})
          console.log("[plan: objetivo-especifico-agregar] Respuesta:", res.data);
          Alert.alert(
            "Éxito",
            "Objetivo específico guardado correctamente.",
            [{
              text: "OK",
              onPress: () => {router.push(`/profesional/${paciente}/plan?recargar=1`)},
            }]
          )
        }
      } else {
        console.log("[plan: objetivo-especifico-agregar] Creando objetivo específico:", { pacienteID, titulo, estado, descripcion });
        {
          const res = await api.post("/objetivos/" + pacienteID + "/", {titulo: titulo,
                                                                        estado: estado,
                                                                        descripcion: descripcion},
                                                                       {timeout: 5000})
          console.log("[plan: objetivo-especifico-agregar] Respuesta:", res.data);
          Alert.alert(
            "Éxito",
            "Objetivo específico guardado correctamente.",
            [{
              text: "OK",
              onPress: () => {router.push(`/profesional/${paciente}/plan?recargarObjetivos=1`)},
            }]
          )
        }
      }
    } catch(err) {
      console.log("[plan: objetivo-especifico-agregar] Error:", err); 
      Alert.alert(
        "Error",
        modoEdicion
        ? "El objetivo específico no pudo ser editado. Intenta nuevamente."
        : "El objetivo específico no pudo ser creado. Intenta nuevamente.",
        [{text: "OK"}]
      )
    } finally {
      setIsLoadingBoton(false);
    }
    */
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
          {modoEdicion ? "Editar objetivo específico" : "Agregar objetivo específico"}
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
            <FormularioCampo
              label={"Estado"}
              value={estado}
              onChangeText={setEstado}
              radioButton
              options={["Logrado", "Medianamente logrado", "No logrado"]}
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
              asterisco={false}
              tipo={2}
            />
            <Boton
              texto="Guardar"
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