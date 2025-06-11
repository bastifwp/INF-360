import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import CategoriaDropdown from '../../../../components/profesional/DropdownObjetivos';

const ObjetivoAgregar = () => {
  const router = useRouter();
  const { paciente } = useLocalSearchParams();

  const [nombre, setNombre] = useState('');
  const [autor, setAutor] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(null);

  const handleGuardar = () => {
    if (!nombre || !autor || !fecha || !descripcion || !categoria) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    console.log('Nuevo objetivo:', { nombre, autor, fecha, descripcion, categoria, paciente });
    router.push(`/profesional/${paciente}/bitacora`);
  };

  return (
    <ScrollView className="flex-1 bg-white">

      <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">Agregar objetivo</Text>

      <Text className="font-semibold mb-1">Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del objetivo"
        className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="font-semibold mb-1">Autor</Text>
      <TextInput
        value={autor}
        onChangeText={setAutor}
        placeholder="Nombre del autor"
        className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="font-semibold mb-1">Fecha</Text>
      <TextInput
        value={fecha}
        onChangeText={setFecha}
        placeholder="AAAA-MM-DD"
        className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="font-semibold mb-1">Categoría</Text>
      <CategoriaDropdown selected={categoria} onSelect={setCategoria} />

      <Text className="font-semibold mb-1">Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción del objetivo"
        multiline
        numberOfLines={4}
        className="border border-gray-400 rounded-xl px-4 py-10 mb-4 text-start"
      />

      <TouchableOpacity
        onPress={handleGuardar}
        className="bg-secondary rounded-xl py-3 mx-4 mt-4 mb-8 items-center"
      >
        <Text className="text-white font-bold text-lg">Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
    
  );
};

export default ObjetivoAgregar;
