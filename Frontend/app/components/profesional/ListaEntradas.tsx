import React, { useRef, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  findNodeHandle,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const iconExample = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png';

const entradas = [
  {
    id: '1',
    nombre: 'Sesión de Terapia Ocupacional',
    autor: 'Dr. Smith',
    fecha: '2025-05-01',
    descripcion: 'Hoy Juanito Perez estaba muy cansado y no quiso realizar todas las actividades',
    icono: iconExample,
    selectedObj: {"1": true, "2": true}
  },
  {
    id: '2',
    nombre: 'Sesión de Fonoaudiología',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Hoy Juanito Perez estaba de buen animo y trabajó de buena manera',
    icono: iconExample,
    selectedObj: {"1": true}
  },
  // ... más entradas
];

const objetivos = [
  {
    id: '1',
    nombre: 'Mejorar comunicación',
    autor: 'Dr. Smith',
    fecha: '2025-05-01',
    descripcion: 'Incrementar la interacción social y el lenguaje funcional en el niño.',
    icono: iconExample,
    color: "#2e7512"
  },
  {
    id: '2',
    nombre: 'Reducir ansiedad',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Implementar técnicas de relajación para disminuir episodios ansiosos.',
    icono: iconExample,
    color:"#d69e02"
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

const EntradaItem = ({ entrada }) => {
  const [expandido, setExpandido] = useState(false);

  

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
          source={{ uri: entrada.icono }}
          style={{ width: 40, height: 40, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{entrada.nombre}</Text>
          <Text style={{ color: '#555' }}>{`Fecha: ${entrada.fecha}`}</Text>
          <Text style={{ color: '#555' }}>{`Autor: ${entrada.autor}`}</Text>
        </View>

        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#555"
        />
      </View>

      {expandido && (
        <>
          <View className='p-2 bg-white my-2 rounded-lg'>
            <Text className='m-2'>{entrada.descripcion}</Text>
          </View>
          <Text className='m-2 font-bold'>Objetivos trabajados</Text>
          <View className='flex-col'>
            {objetivos.filter(item => entrada.selectedObj[item.id]).map((item) => (
              <View key={item.id} 
                    className="flex-1 items-center justify-between py-3 rounded-3xl my-2"
                    style={{backgroundColor: item.color}}>
                <Text className='color-white font-bold'>{item.nombre}</Text>
              </View>
            ))}
          </View>
        </>
        
      )}
    </TouchableOpacity>
  );
};

const ListaEntradas = () => {
  return (
    <FlatList
      data={entradas}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <EntradaItem entrada={item} />}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};

export default ListaEntradas;