import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router"

import CategoriaDropdown from '../../../../components/profesional/DropdownObjetivos';

const ObjetivoEditar = () => {

  const router = useRouter();
  const { paciente, id } = useLocalSearchParams();

  const [titulo, settitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(null);

  // Simula carga de datos del objetivo
  useEffect(() => {
    const fetchObjetivo = async () => {
      // Simulación con datos falsos
      // Reemplaza esto con una llamada real a tu API (fetch o axios)
      const objetivoMock = {
        id: id,
        titulo: 'Mejorar comunicación',
        descripcion: 'Incrementar la interacción social y el lenguaje funcional en el niño.',
        categoria: 'Comunicación',
        autor_creacion: 'Dr. Smith',
        fecha_creacion: '2025-05-01',
        autor_modificacion: 'Dr. Smith',
        fecha_modificacion: '2025-05-01',
      };

      // Rellenar los estados
      settitulo(objetivoMock.titulo);
      setAutor(objetivoMock.autor_creacion);
      setFecha(objetivoMock.fecha_creacion);
      setDescripcion(objetivoMock.descripcion);
      setCategoria(objetivoMock.categoria)
      setLoading(false);
    };

    if (id) {
      fetchObjetivo();
    }
  }, [id]);

  const handleGuardar = () => {
    if (!titulo || !autor || !fecha || !descripcion) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Aquí podrías llamar a una API para actualizar el objetivo
    console.log('Objetivo editado:', { id, titulo, autor, fecha, descripcion, paciente });

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
    <ScrollView className="flex-1 bg-white">
      <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">Agregar objetivo</Text>

      <Text className="font-semibold mb-1">titulo</Text>
      <TextInput
        value={titulo}
        onChangeText={settitulo}
        placeholder="titulo del objetivo"
        className="border border-gray-400 rounded-xl px-4 py-3 mb-4"
      />

      <Text className="font-semibold mb-1">Autor</Text>
      <TextInput
        value={autor}
        onChangeText={setAutor}
        placeholder="titulo del autor"
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

export default ObjetivoEditar;