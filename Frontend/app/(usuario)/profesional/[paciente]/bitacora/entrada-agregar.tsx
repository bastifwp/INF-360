import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { DescartarCambiosContext } from '../../../../context/DescartarCambios';
import CustomMultiSelect  from '../../../../components/profesional/SelectObjetivos'
import { useAuth } from '@/app/context/auth';

// === Lista de objetivos CON categoría ===
const objetivos = [
  { id: 1, nombre: 'Mejorar comunicación', categoria: 'Comunicación' },
  { id: 2, nombre: 'Fomentar autonomía', categoria: 'Motricidad' },
  { id: 3, nombre: 'Desarrollar habilidades motoras', categoria: 'Motricidad' },
  { id: 4, nombre: 'Reducir conductas disruptivas', categoria: 'Conducta' },
];

// === Colores de categorías ===
const categoriaColores = {
  Comunicación: '#4f83cc',
  Motricidad: '#81c784',
  Cognición: '#f48fb1',
  Conducta: '#ffb74d',
  default: '#b0bec5',
};

const EntradaAgregar = () => {

  const router = useRouter();
  const navigation = useNavigation();
  const { paciente } = useLocalSearchParams();
  const [paciente_id, encodedNombre] = paciente?.split("-") ?? [null, null];

  const [titulo, setTitulo] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [selected_obj, setSelected_obj] = useState<number[]>([]);

 const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const [entrada, setEntrada] = useState({});
  const [objetivos, setObjetivos] = useState([]);


  //Hacemos la consulta para tener todos los objetivos de la base de datos

  useEffect(() => {
      if (!authToken || !refreshToken) return;
  
      const api = createApi(authToken, refreshToken, setAuthToken);

      api
          .get('/objetivos/'+paciente_id+'/')
          .then(res => setObjetivos(res.data))
          .catch(err => console.log(err));
  },[authToken, refreshToken]); // 👈 se ejecuta cada vez que cambien

  

    
  const datosIniciales = useRef({
    titulo: '',
    comentarios: '',
    selected_obj: {},
  });

  useEffect(() => {
    datosIniciales.current = {
      titulo: '',
      comentarios: '',
      selected_obj: {},
    };
  }, []);

  const hayCambios = () => {
    if (titulo !== datosIniciales.current.titulo) return true;
    if (comentarios !== datosIniciales.current.comentarios) return true;
    const keys = new Set([
      ...Object.keys(selected_obj),
      ...Object.keys(datosIniciales.current.selected_obj),
    ]);
    for (const k of keys) {
      if (!!selected_obj[k] !== !!datosIniciales.current.selected_obj[k]) return true;
    }
    return false;
  };

  // DESCARTAR CAMBIOS
  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      if (!hayCambios()) return;
      e.preventDefault();
      Alert.alert(
        '¿Descartar cambios?',
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return beforeRemoveListener;
  }, [navigation, titulo, comentarios, selected_obj]);

  // DESCARTAR CAMBIOS
  const handleDescartarCambiosEntrada = (path) => {
    if (hayCambios()) {
      Alert.alert(
        '¿Descartar cambios?',
        'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => router.push(path),
          },
        ]
      );
    } else {
      router.push(path);
    }
  };

  const handleGuardar = () => {
    if (!titulo || !comentarios || !selected_obj) {
      Alert.alert('Error', 'Por favor completa todos los campos y selecciona un objetivo');
      return;
    }
    console.log(selected_obj);
    console.log('Guardar entrada:', {
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
          .post('/bitacora/'+paciente_id+'/', {
                                              titulo,
                                              comentarios,
                                              paciente,
                                              selected_obj
          }, {timeout: 5000})
          .then(res => {console.log(res.data);
                        Alert.alert(
                        'Éxito',
                        'Entrada guardada correctamente',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              // Ejemplo: ir a la lista de entradas
                              router.push(`/profesional/${paciente}/bitacora`);
                            },
                          },
                        ])                 
          })
          .catch(err => {console.log(err)
                         Alert.alert(
                        'Error',
                        'Entrada no pudo guardarse',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              // Ejemplo: ir a la lista de entradas
                              router.push(`/profesional/${paciente}/bitacora`);
                            },
                          },
                        ])
          })      
    };

    
    //ACÁ DEBERÍAMOS PONER UN CASO EN EL QUE NO SE GUARDA EXITOSAMENTE
  };

  return (
  <DescartarCambiosContext.Provider value={{ handleDescartarCambiosEntrada }}>
    <KeyboardAwareScrollView className="flex-1 bg-white" 
                             contentContainerStyle={{ padding: 8 }} 
                             keyboardShouldPersistTaps="handled"
                             extraScrollHeight={20}>
      <>
        <Text className="text-3xl font-bold my-2 self-center" style={{ color: '#114F80' }}>
          Agregar entrada
        </Text>

        <Text className="font-semibold mb-2">Título</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
          maxLength={255}
        />

        <Text className="font-semibold mb-2">Objetivo</Text>
        <CustomMultiSelect
          items={objetivos}
          selected={selected_obj}
          onChange={setSelected_obj}
        />

        <Text className="font-semibold mb-2">Comentarios</Text>
        <TextInput
          value={comentarios}
          onChangeText={setComentarios}
          placeholder="Comentarios"
          multiline
          numberOfLines={4}
          className="border border-gray-400 rounded-xl px-4 py-10 mb-8 text-start"
          maxLength={4000}
        />

        <TouchableOpacity
          onPress={handleGuardar}
          className="bg-secondary rounded-xl py-3 mx-4 mb-8 items-center"
          style={{ backgroundColor: '#F26052' }}
        >
          <Text className="text-white font-bold text-lg">Guardar</Text>
        </TouchableOpacity>
      </>
    </KeyboardAwareScrollView>
  </DescartarCambiosContext.Provider>

  );
};

export default EntradaAgregar;