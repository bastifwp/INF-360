import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";
import { icons }  from "@/constants/icons"
import Checkbox from 'expo-checkbox'; //Esto se instala

const objetivos = [
  {
    id: '1',
    nombre: 'Mejorar comunicación',
    autor: 'Dr. Smith',
    fecha: '2025-05-01',
    descripcion: 'Incrementar la interacción social y el lenguaje funcional en el niño.',
    icono: icons.plan,
  },
  {
    id: '2',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: icons.plan,
  },
  {
    id: '3',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: icons.plan,
  },
  {
    id: '4',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: icons.plan,
  },
  {
    id: '5',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: icons.plan,
  },
]

const EntradaAgregar = () => {
  const router = useRouter();
  const { paciente } = useLocalSearchParams();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [fecha, setFecha] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [selectedObj, setSelectedObj] = useState({}); // { '1': true, '2': false, ... }

  const toggleCheckbox = (id) => {
    setSelectedObj((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGuardar = () => {

    if (!titulo|| !autor || !fecha || !comentarios) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
 
    const seleccionados = objetivos.filter(item => selectedObj[item.id]);
    //Objetivos seleccionados
    console.log('Seleccionados:', seleccionados);

    // Aquí podrías llamar a una API o hacer la lógica para guardar el objetivo
    console.log('Nueva Entrada:', { titulo, autor, fecha, comentarios, paciente, selectedObj });

    // Después de guardar, regresa a la bitácora
    router.push(`/profesional/${paciente}/bitacora`);
  };

  return (
    <ScrollView className="flex-col bg-white">
      <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">Agregar entrada</Text>

      <Text className="font-semibold mb-1">Título</Text>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título"
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

      <Text className="font-semibold mb-1">Objetivos Trabajados</Text>
      <View className='px-1 py-3 mb-2'>
        {objetivos.map((item) => (
            <View key={item.id} className="flex-row-reverse items-center justify-between py-3">
                <Checkbox
                    value={!!selectedObj[item.id]}
                    onValueChange={() => toggleCheckbox(item.id)}
                    className="mr-3"
                    color={"#F26052"}
                />
                <Text>{item.nombre}</Text>
            </View>
        ))}
      </View>

      <Text className="font-semibold mb-1">Comentarios</Text>
      <TextInput
        value={comentarios}
        onChangeText={setComentarios}
        placeholder="Ingrese su comentario"
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
  )
}

export default EntradaAgregar;