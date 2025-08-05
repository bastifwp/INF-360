import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAuth } from '@/context/auth';

const metas = [{
    id: "1",
    titulo: "Reconoce vocales",
    estado: "Logrado",
    color: "#306e21"
},
{
    id: "2",
    titulo: "Pronuncia la letra R correctamente",
    estado: "Medianamente Logrado",
    color: "#d1ae00"
}];

const categoriaColores = {
  Comunicación: '#4f83cc',  // Azul
  Motricidad: '#81c784',    // Verde
  Cognición: '#f48fb1',     // Rosado
  Conducta: '#ffb74d',      // Naranjo
  default: '#b0bec5'        // Gris por defecto
};

const MetaItem = ({ meta, onChange }) => {

  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const { paciente } = useLocalSearchParams();
  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const handleEditar = () => {
    router.push(`/profesional/${paciente}/plan/objetivo-editar?id=${meta.id}`);
  };

  const handleEliminar = () => {
    /*Alert.alert(
      'Eliminar objetivo',
      `¿Estás seguro que quieres eliminar "${objetivo.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => console.log('Eliminado', objetivo.id), style: 'destructive' },
      ]
    );*/
      {
        if (!authToken || !refreshToken) return;

        const api = createApi(authToken, refreshToken, setAuthToken);

        api
            .delete('/objetivos/detalle/'+meta.id+'/')
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
  };
    

  //const colorCategoria = categoriaColores[objetivo.categoria] || categoriaColores.default;

  return (
    <View
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
            name="square"  // Puedes usar otro icono si quieres
            size={40}
            color={meta.color}
            style={{ width: 40, height: 40, marginRight: 12 }}
            aria-label={meta.estado}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{meta.titulo}</Text>
            <Text style={{ color: '#555' }}>{`Estado: ${meta.estado}`}</Text>
          </View>
        </View>
        {/*
        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#555"
        />
        */}
      </View>
      {/*
      {expandido && (
        <>
          <Text style={{ marginTop: 8, color: '#333' }}>{objetivo.descripcion}</Text>

          {objetivo.autor_modificacion && objetivo.fecha_modificacion && (
            <Text style={{ color: '#777', fontSize: 12, marginTop: 4 }}>
              Última modificación por {objetivo.autor_modificacion} el {objetivo.fecha_modificacion}
            </Text>
          )}

          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={handleEditar}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: '#d2f7cd',
                borderRadius: 8,
                marginRight: 16
              }}
            >
              <Ionicons name="create-outline" size={20} color="#125c0a" />
              <Text style={{ marginLeft: 8, color: '#333', fontWeight: 'bold' }}>Editar objetivo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEliminar}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: '#ffe6e6',
                borderRadius: 8,
                marginRight: 16
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#e53935" />
              <Text style={{ marginLeft: 8, color: '#333', fontWeight: 'bold' }}>Eliminar objetivo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      */}  
    </View>
  );
};

const ListaMetas = ({ metas, onChange }) => {
  return (
    <FlatList
      data={metas}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <MetaItem meta={item} onChange={onChange} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};

export default ListaMetas;