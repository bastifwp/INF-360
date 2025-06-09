import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";

const ObjetivoAgregar = () => {
  const router = useRouter();
  const { paciente } = useLocalSearchParams();

  const [nombre, setNombre] = useState('');
  const [autor, setAutor] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleGuardar = () => {
    if (!nombre || !autor || !fecha || !descripcion) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Aquí podrías llamar a una API o hacer la lógica para guardar el objetivo
    console.log('Nuevo objetivo:', { nombre, autor, fecha, descripcion, paciente });

    // Después de guardar, regresa a la bitácora
    router.push(`/profesional/${paciente}/bitacora`);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Agregar Objetivo</Text>

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
  )
}

export default ObjetivoAgregar;