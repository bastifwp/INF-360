import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tenerlo instalado
import { useRouter, useLocalSearchParams } from "expo-router";

const iconExample = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png'
const arrowDown = 'https://cdn-icons-png.flaticon.com/512/271/271210.png' // flecha hacia abajo
const arrowUp = 'https://cdn-icons-png.flaticon.com/512/271/271228.png'   // flecha hacia arriba

const objetivos = [
  {
    id: '1',
    nombre: 'Mejorar comunicación',
    autor: 'Dr. Smith',
    fecha: '2025-05-01',
    descripcion: 'Incrementar la interacción social y el lenguaje funcional en el niño.',
    icono: iconExample,
  },
  {
    id: '2',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: iconExample,
  },
  {
    id: '3',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: iconExample,
  },
  {
    id: '4',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: iconExample,
  },
  {
    id: '5',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: iconExample,
  },
]

const ObjetivoItem = ({ objetivo }) => {
  const [expandido, setExpandido] = useState(false);

  const router = useRouter();

  const { paciente } = useLocalSearchParams();

  const handleEditar = () => {
    router.push(`/profesional/${paciente}/plan/objetivo-editar?id=${objetivo.id}`);
  };

  const handleEliminar = () => {
    Alert.alert(
      'Eliminar objetivo',
      `¿Estás seguro que quieres eliminar "${objetivo.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => console.log('Eliminado', objetivo.id), style: 'destructive' },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={() => setExpandido(!expandido)}
      style={{
        padding: 12,
        backgroundColor: '#f0f4f8',
        marginVertical: 6,
        borderRadius: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: objetivo.icono }}
          style={{ width: 40, height: 40, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{objetivo.nombre}</Text>
          <Text style={{ color: '#555' }}>{`Autor: ${objetivo.autor}`}</Text>
          <Text style={{ color: '#555' }}>{`Fecha: ${objetivo.fecha}`}</Text>
        </View>

        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#555"
        />
      </View>

      {expandido && (
        <>
          <Text style={{ marginTop: 8, color: '#333' }}>{objetivo.descripcion}</Text>

          <View className='mt-3 flex-row justify-between'>
            <TouchableOpacity onPress={handleEditar} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              backgroundColor: '#d2f7cd', 
              borderRadius: 8,
              marginRight: 16
            }}>
              <Ionicons name="create-outline" size={20} color="#125c0a" />
              <Text style={{ marginLeft: 8, color: '#333', fontWeight: 'bold' }}>Editar objetivo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEliminar} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingHorizontal: 12, 
              paddingVertical: 8, 
              backgroundColor: '#ffe6e6', 
              borderRadius: 8,
              marginRight: 16
            }}>
              <Ionicons name="trash-outline" size={20} color="#e53935" />
              <Text style={{ marginLeft: 8, color: '#333', fontWeight: 'bold' }}>Eliminar objetivo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const ListaObjetivos = () => {
  return (
    <FlatList
      data={objetivos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ObjetivoItem objetivo={item} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  )
}

export default ListaObjetivos