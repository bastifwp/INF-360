import React, { useState } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ✅ ICONO POR DEFECTO
const iconExample = 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png';

// ✅ Colores por categoría
const categoriaColores = {
  Comunicación: '#4f83cc',  // Azul
  Motricidad: '#81c784',    // Verde
  Cognición: '#f48fb1',     // Rosado
  Conducta: '#ffb74d',      // Naranjo
  default: '#b0bec5',       // Gris
};

// ✅ Lista de entradas ejemplo con selectedObj como lista de objetos
const entradas = [
  {
    id: '1',
    nombre: 'Sesión de Terapia Ocupacional',
    autor: 'Dr. Smith',
    fecha: '2025-05-01',
    descripcion: 'Hoy Juanito Perez estaba muy cansado y no quiso realizar todas las actividades',
    selectedObj: [
      { nombre: 'Mejorar comunicación', categoria: 'Comunicación' },
      { nombre: 'Motricidad gruesa', categoria: 'Motricidad' },
    ],
  },
  {
    id: '2',
    nombre: 'Sesión de Fonoaudiología',
    autor: 'Dra. López',
    fecha: '2025-04-15',
    descripcion: 'Hoy Juanito Perez estaba de buen ánimo y trabajó de buena manera',
    selectedObj: [
      { nombre: 'Desarrollar lenguaje', categoria: 'Comunicación' },
    ],
  },
  // Puedes agregar más entradas si quieres
];

// ✅ Componente de ítem individual
const EntradaItem = ({ entrada }) => {
  const [expandido, setExpandido] = useState(false);

  const getObjetivoColor = (categoria) => {
    return categoriaColores[categoria] || categoriaColores.default;
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
          source={{ uri: entrada.icono || iconExample }}
          style={{ width: 40, height: 40, marginRight: 12, borderRadius: 20 }}
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
          <View style={{ padding: 8, backgroundColor: 'white', marginVertical: 8, borderRadius: 8 }}>
            <Text>{entrada.descripcion}</Text>
          </View>
          <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>Objetivos trabajados</Text>
          <View style={{ marginTop: 8 }}>
            {entrada.selectedObj?.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: getObjetivoColor(item.categoria),
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                  marginVertical: 4,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.nombre}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

// ✅ Lista principal
const ListaEntradas = () => {
  return (
    <FlatList
      data={entradas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EntradaItem entrada={item} />}
      contentContainerStyle={{ padding: 4, paddingBottom: 50 }}
    />
  );
};

export default ListaEntradas;
