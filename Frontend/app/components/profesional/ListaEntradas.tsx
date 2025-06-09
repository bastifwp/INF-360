import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const iconExample = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png';

const entradas = [
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
  // ... más entradas
];

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
          <Text style={{ color: '#555' }}>{`Autor: ${entrada.autor}`}</Text>
          <Text style={{ color: '#555' }}>{`Fecha: ${entrada.fecha}`}</Text>
        </View>

        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#555"
        />
      </View>

      {expandido && (
        <Text style={{ marginTop: 8, color: '#333' }}>{entrada.descripcion}</Text>
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