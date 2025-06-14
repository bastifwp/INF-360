import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";

const categoriaColores = {
  Comunicación: '#4f83cc',  // Azul
  Motricidad: '#81c784',    // Verde
  Cognición: '#f48fb1',     // Rosado
  Conducta: '#ffb74d',      // Naranjo
  default: '#b0bec5'        // Gris por defecto
};

const ObjetivoItem = ({ objetivo }) => {
  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const { paciente } = useLocalSearchParams();

  const colorCategoria = categoriaColores[objetivo.categoria] || categoriaColores.default;

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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {/* Ícono de categoría con color */}
          <Ionicons
            name="ellipse"  // Puedes usar otro icono si quieres
            size={40}
            color={colorCategoria}
            style={{ width: 40, height: 40, marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{objetivo.titulo}</Text>
            <Text style={{ color: '#555' }}>{`Fecha: ${objetivo.fecha_creacion}`}</Text>
            <Text style={{ color: '#555' }}>{`Autor: ${objetivo.autor_creacion}`}</Text>
          </View>
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

          {objetivo.autor_modificacion && objetivo.fecha_modificacion && (
            <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>
              Última modificación por {objetivo.autor_modificacion} el {objetivo.fecha_modificacion}
            </Text>
          )}

        </>
      )}
    </TouchableOpacity>
  );
};

const ListaObjetivos = ({ objetivos }) => {
  return (
    <FlatList
      data={objetivos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ObjetivoItem objetivo={item} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};

export default ListaObjetivos;
