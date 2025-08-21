import React, { useEffect, useMemo, useState, useRef } from "react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/Boton";
import { Titulo } from "@/components/Titulo";
import { colores } from "@/constants/colores";
import { IndicadorCarga } from "@/components/IndicadorCarga";
import { FormularioCampo } from "@/components/FormularioCampo";
import { DescartarCambiosContext } from "@/context/DescartarCambios";

const categorias = ['Comunicación', 'Motricidad', 'Cognición', 'Conducta'];

const categoriaColores = {
  Comunicación: '#4f83cc',
  Motricidad: '#81c784',
  Cognición: '#f48fb1',
  Conducta: '#ffb74d',
  default: '#b0bec5',
};

export function FormularioCampoSelectCategoria({ label, placeholder, selected, onSelect }) {
  //ESTADOS
  const [search, setSearch] = useState('');
  //FILTRAR CATEGORÍAS SEGÚN BÚSQUEDA
  const filteredCategorias = useMemo(() => {
    if (!search) return categorias;
    return categorias.filter(cat =>
      cat.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
  return (
    <View className="my-2 mb-4">
      <Text className="text-black font-semibold mb-2">{label}</Text>
      {/* Chip seleccionado */}
      {selected && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: categoriaColores[selected] || categoriaColores.default,
            borderRadius: 18,
            paddingHorizontal: 12,
            paddingVertical: 4,
            marginBottom: 8
          }}
        >
          <Text style={{ color: 'white', marginRight: 6 }}>{selected}</Text>
          <TouchableOpacity onPress={() => onSelect(null)}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>×</Text>
          </TouchableOpacity>
        </View>
      )}
      <FormularioCampo
        value={search}
        onChangeText={setSearch}
        placeholder={placeholder}
        tipo={2}
        maxLength={255}
      />
      <ScrollView style={{ maxHeight: 160, marginBottom: 8 }} nestedScrollEnabled={true} persistentScrollbar={true}>
        {filteredCategorias.map(cat => {
          const color = categoriaColores[cat] || categoriaColores.default;
          const isSelected = selected === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelect(cat)}
              style={{
                padding: 12,
                backgroundColor: colores.lightgrey,
                borderWidth: 1,
                borderColor: isSelected ? color : colores.lightgrey,
                borderRadius: 12,
                marginBottom: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: color,
                  marginRight: 10,
                }}
              />
              <Text style={{ color: isSelected ? color : colores.mediumdarkgrey }}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function FormularioObjetivo() {
    
  const router = useRouter();

  const navigation = useNavigation();
    
  const { paciente, id } = useLocalSearchParams(); //id: ID del objetivo
  const [pacienteID, pacienteEncodedNombre] = paciente?.split("-") ?? [null, null];
  //Si es agregar-objetivo, id es undefined
  //Si es editar-objetivo, id es id_objetivo
    
  //ESTADOS
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [objetivo, setObjetivo] = useState(null);
  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const datosIniciales = useRef({ titulo: '', descripcion: '', categoria: null });

  const modoEdicion = !!id; 
  //Si es agregar-objetivo, modoEdicion es false
  //Si es editar-objetivo, modoEdicion es true

  useEffect(() => {
    if (modoEdicion) {
      if (!authToken || !refreshToken) return;
      const api = createApi(authToken, refreshToken, setAuthToken);
      api
        .get("/objetivos/detalle/" + id + "/")
        .then(res => {
          const data = res.data;
          setObjetivo(data);
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
        .catch(err => {
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
    
  const handleGuardar = () => {
    if (!titulo || !descripcion || !categoria) {
      console.log("[plan: formulario-objetivo] Error. Por favor, completa todos los campos requeridos...");
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }
    if (modoEdicion) {
      console.log("[plan: formulario-objetivo] Editando objetivo:", { pacienteID, titulo, descripcion, categoria });
      {
        if (!authToken || !refreshToken) return;
        const api = createApi(authToken, refreshToken, setAuthToken);
        api
          .put("/objetivos/detalle/" + id + "/", {titulo: titulo,
                                                  descripcion: descripcion,
                                                  categoria:  categoria},
          {timeout: 5000})
          .then(res => {console.log("[plan: formulario-objetivo] Respuesta:", res.data);
                        Alert.alert(
                          "Éxito",
                          "Objetivo guardado correctamente.",
                          [{
                            text: "OK",
                            onPress: () => {router.push(`/profesional/${paciente}/plan?recargarObjetivos=1`)},
                          }]
                        )
          })
          .catch(err => {console.log("[plan: formulario-objetivo] Error:", err);
                        Alert.alert(
                          "Error",
                          "El objetivo no pudo ser editado.",
                          [{
                            text: "OK",
                            onPress: () => {router.push(`/profesional/${paciente}/plan`)},
                          }]
                        )
          })      
        };
      } else {
        console.log("[plan: formulario-objetivo] Creando objetivo:", { pacienteID, titulo, descripcion, categoria });
        {
          if (!authToken || !refreshToken) return;
          const api = createApi(authToken, refreshToken, setAuthToken);
          api
            .post("/objetivos/" + pacienteID + "/", {titulo: titulo,
                                                    descripcion: descripcion,
                                                    categoria:  categoria},
            {timeout: 5000})
            .then(res => {console.log("[plan: formulario-objetivo] Respuesta:", res.data);
                          Alert.alert(
                            "Éxito",
                            "Objetivo guardado correctamente.",
                            [{
                              text: "OK",
                              onPress: () => {router.push(`/profesional/${paciente}/plan?recargarObjetivos=1`)},
                            }]
                          )
            })
            .catch(err => {console.log("[plan: formulario-objetivo] Error:", err); 
                          Alert.alert(
                            "Error",
                            "El objetivo no pudo ser creado.",
                            [{
                              text: "OK",
                              onPress: () => {router.push(`/profesional/${paciente}/plan`)},
                            }]
                          )
            })      
        };
      }
      //CASO EN EL QUE NO SE GUARDA EXITOSAMENTE
    }

    if (isLoading) {
        return (
            <IndicadorCarga/>
        );
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
          {modoEdicion ? 'Editar objetivo' : 'Agregar objetivo'}
        </Titulo>
        <FormularioCampo
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ingresa un título"
          tipo={2}
          maxLength={255}
        />
        <FormularioCampoSelectCategoria
          label="Categoría"
          placeholder="Busca o selecciona una categoría..."
          selected={categoria}
          onSelect={setCategoria}
        />
        <FormularioCampo
          label="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingresa una descripción"
          tipo={2}
          multiline
          maxLength={4000}
        />
        <Boton
          texto="Guardar"
          onPress={handleGuardar}
          tipo={3}
        />
      </KeyboardAwareScrollView>
    </DescartarCambiosContext.Provider>
  );
};