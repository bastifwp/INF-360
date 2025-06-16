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
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{entrada.titulo}</Text>
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
          <View style={{ padding: 8, marginVertical: 8, borderRadius: 8, backgroundColor: "#ffffff"}}>
            <Text className='text-black'>{entrada.comentarios}</Text>
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
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.titulo}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

// ✅ Lista principal
const ListaEntradas = ({ entradas }) => {
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
