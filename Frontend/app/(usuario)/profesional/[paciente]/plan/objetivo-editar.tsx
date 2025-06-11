import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router"

const ObjetivoEditar = () => {
  const router = useRouter();
  const { paciente, id } = useLocalSearchParams();

  const [nombre, setNombre] = useState('');
  const [autor, setAutor] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);

  // Simula carga de datos del objetivo
  useEffect(() => {
    const fetchObjetivo = async () => {
      // Simulación con datos falsos
      // Reemplaza esto con una llamada real a tu API (fetch o axios)
      const objetivoMock = {
        id: id,
        nombre: "Objetivo ejemplo",
        autor: "Dra. Pérez",
        fecha: "2024-05-20",
        descripcion: "Descripción de ejemplo",
      };

      // Rellenar los estados
      setNombre(objetivoMock.nombre);
      setAutor(objetivoMock.autor);
      setFecha(objetivoMock.fecha);
      setDescripcion(objetivoMock.descripcion);
      setLoading(false);
    };

    if (id) {
      fetchObjetivo();
    }
  }, [id]);

  const handleGuardar = () => {
    if (!nombre || !autor || !fecha || !descripcion) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Aquí podrías llamar a una API para actualizar el objetivo
    console.log('Objetivo editado:', { id, nombre, autor, fecha, descripcion, paciente });

    router.push(`/profesional/${paciente}/plan`);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-600">Cargando objetivo...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Editar Objetivo</Text>

      <Text className="font-semibold mb-1">Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del objetivo"
        className="border border-gray-400 rounded-md px-3 py-2 mb-4"
      />

      <Text className="font-semibold mb-1">Autor</Text>
      <TextInput
        value={autor}
        onChangeText={setAutor}
        placeholder="Nombre del autor"
        className="border border-gray-400 rounded-md px-3 py-2 mb-4"
      />

      <Text className="font-semibold mb-1">Fecha</Text>
      <TextInput
        value={fecha}
        onChangeText={setFecha}
        placeholder="AAAA-MM-DD"
        className="border border-gray-400 rounded-md px-3 py-2 mb-4"
      />

      <Text className="font-semibold mb-1">Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción del objetivo"
        multiline
        numberOfLines={4}
        className="border border-gray-400 rounded-md px-3 py-2 mb-4 text-start"
      />

      <TouchableOpacity
        onPress={handleGuardar}
        className="bg-blue-600 rounded-md py-3 items-center"
      >
        <Text className="text-white font-bold text-lg">Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ObjetivoEditar;