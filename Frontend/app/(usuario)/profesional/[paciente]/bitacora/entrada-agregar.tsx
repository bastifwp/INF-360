import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { DescartarCambiosContext } from '../../../../context/DescartarCambios';

// === Lista de objetivos CON categoría ===
const objetivos = [
  { nombre: 'Mejorar comunicación', categoria: 'Comunicación' },
  { nombre: 'Fomentar autonomía', categoria: 'Motricidad' },
  { nombre: 'Desarrollar habilidades motoras', categoria: 'Motricidad' },
  { nombre: 'Reducir conductas disruptivas', categoria: 'Conducta' },
];

// === Colores de categorías ===
const categoriaColores = {
  Comunicación: '#4f83cc',
  Motricidad: '#81c784',
  Cognición: '#f48fb1',
  Conducta: '#ffb74d',
  default: '#b0bec5',
};

// === Dropdown para seleccionar objetivo CON COLOR ===
const ObjetivoDropdown = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (objetivo) => {
    onSelect(objetivo);
    setOpen(false);
  };

  return (
    <View className="my-2 mb-4">
      {/* Botón principal */}
      <TouchableOpacity
        className="border border-gray-400 rounded-xl px-4 py-3 flex-row items-center"
        onPress={() => setOpen(!open)}
      >
        {selected && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: categoriaColores[selected.categoria] || categoriaColores.default,
              marginRight: 10,
            }}
          />
        )}
        <Text className={`text-base ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
          {selected?.nombre || 'Selecciona un objetivo'}
        </Text>
      </TouchableOpacity>

      {/* Lista desplegable */}
      {open && (
        <View className="bg-white rounded-xl border border-gray-300 shadow-lg">
          {objetivos.map((item) => {
            const color = categoriaColores[item.categoria] || categoriaColores.default;
            return (
              <TouchableOpacity
                key={item.nombre}
                className="px-4 py-3 border-b border-gray-200 flex-row items-center"
                onPress={() => handleSelect(item)}
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
                <Text className="text-base text-gray-900">{item.nombre}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const EntradaAgregar = () => {

  const router = useRouter();
  const navigation = useNavigation();
  const { paciente } = useLocalSearchParams();

  const [titulo, setTitulo] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [selectedObj, setSelectedObj] = useState({});
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState(null);

  const datosIniciales = useRef({
    titulo: '',
    comentarios: '',
    selectedObj: {},
    objetivoSeleccionado: null,
  });

  useEffect(() => {
    datosIniciales.current = {
      titulo: '',
      comentarios: '',
      selectedObj: {},
      objetivoSeleccionado: null,
    };
  }, []);

  const toggleCheckbox = (id) => {
    setSelectedObj((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hayCambios = () => {
    if (titulo !== datosIniciales.current.titulo) return true;
    if (comentarios !== datosIniciales.current.comentarios) return true;
    if (objetivoSeleccionado !== datosIniciales.current.objetivoSeleccionado) return true;
    const keys = new Set([
      ...Object.keys(selectedObj),
      ...Object.keys(datosIniciales.current.selectedObj),
    ]);
    for (const k of keys) {
      if (!!selectedObj[k] !== !!datosIniciales.current.selectedObj[k]) return true;
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
  }, [navigation, titulo, comentarios, selectedObj, objetivoSeleccionado]);

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
    if (!titulo || !comentarios || !objetivoSeleccionado) {
      Alert.alert('Error', 'Por favor completa todos los campos y selecciona un objetivo');
      return;
    }
    console.log('Guardar entrada:', {
      titulo,
      comentarios,
      paciente,
      objetivosSeleccionados: Object.entries(selectedObj)
        .filter(([_, val]) => val)
        .map(([key]) => key),
      objetivoPrincipal: objetivoSeleccionado,
    });
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
    //ACÁ DEBERÍAMOS PONER UN CASO EN EL QUE NO SE GUARDA EXITOSAMENTE
  };

  return (
    
    <DescartarCambiosContext.Provider value={{ handleDescartarCambiosEntrada }}>

      <ScrollView className="flex-1 bg-white">

        <Text className="text-3xl font-bold my-4 self-center" style={{ color: '#114F80' }}>
          Agregar entrada
        </Text>

        <Text className="font-semibold mb-1">Título</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
        />

        <Text className="font-semibold mb-1">Objetivo</Text>
        <ObjetivoDropdown
          selected={objetivoSeleccionado}
          onSelect={setObjetivoSeleccionado}
        />

        <Text className="font-semibold mb-1">Comentarios</Text>
        <TextInput
          value={comentarios}
          onChangeText={setComentarios}
          placeholder="Comentarios"
          multiline
          numberOfLines={4}
          className="border border-gray-400 rounded-xl px-4 py-10 mb-8 text-start"
        />

        <TouchableOpacity
          onPress={handleGuardar}
          className="bg-secondary rounded-xl py-3 mx-4 mb-8 items-center"
          style={{ backgroundColor: '#F26052' }}
        >
          <Text className="text-white font-bold text-lg">Guardar</Text>
        </TouchableOpacity>

      </ScrollView>

    </DescartarCambiosContext.Provider>

  );
};

export default EntradaAgregar;
