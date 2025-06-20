import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAuth } from '@/app/context/auth';

const categoriaColores = {
  Comunicación: '#4f83cc',  // Azul
  Motricidad: '#81c784',    // Verde
  Cognición: '#f48fb1',     // Rosado
  Conducta: '#ffb74d',      // Naranjo
  default: '#b0bec5'        // Gris por defecto
};

const ObjetivoItem = ({ objetivo, onChange }) => {

  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const { paciente } = useLocalSearchParams();
  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const handleEditar = () => {
    router.push(`/profesional/${paciente}/plan/objetivo-editar?id=${objetivo.id}`);
  };

  const handleEliminar = () => {
    Alert.alert(
      'Eliminar objetivo',
      `¿Estás seguro que quieres eliminar "${objetivo.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => {console.log('Eliminado', objetivo.id);
          {
            if (!authToken || !refreshToken) return;

            const api = createApi(authToken, refreshToken, setAuthToken);

            api
                .delete('/objetivos/detalle/'+objetivo.id+'/',{timeout:5000})
                .then(res => {console.log(res.status);
                              onChange()})
                .catch(err => {
                                if (!err.request){
                                  // El servidor respondió con un código de error HTTP y no es porque el body de
                                  // la respuesta esté vacío
                                  console.log('Error al eliminar objetivo:', err.message);
                                  //console.log('Error en respuesta:', err.response.status);
                                  //console.log('Datos:', err.response.data);
                                }
                                onChange();
                              });
                          
          } 
        }, style: 'destructive' },
      ]
    );
           
  };
    

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
          <View style={{ padding: 8, marginVertical: 8, borderRadius: 8}}>
            <Text className='text-black'>{objetivo.descripcion}</Text>
          </View>

          <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>Categoría:</Text>

          <View
            style={{
              backgroundColor: categoriaColores[objetivo.categoria] || categoriaColores.default,
              marginTop: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 30,
              marginVertical: 4,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {objetivo.categoria}
            </Text>
          </View>

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

const ListaObjetivos = ({ objetivos, onChange }) => {
  return (
    <FlatList
      data={objetivos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ObjetivoItem objetivo={item} onChange={onChange} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};

export default ListaObjetivos;
