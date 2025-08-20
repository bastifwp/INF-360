import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAuth } from '@/context/auth';

const actividades = [{
    id: "1",
    titulo: "Juego de memoria",
    descripcion: "Juego de memoria con cartas que contienen figuras",
    duración: "#306e21"
},
{
    id: "2",
    titulo: "Lectura guiada",
    descripcion: "Tiempo de lectura con ayuda de un profesional",
    duración: "#306e21"
}];

const categoriaColores = {
  Comunicación: '#4f83cc',  // Azul
  Motricidad: '#81c784',    // Verde
  Cognición: '#f48fb1',     // Rosado
  Conducta: '#ffb74d',      // Naranjo
  default: '#b0bec5'        // Gris por defecto
};

const ActividadItem = ({ actividad, onChange }) => {

  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const { paciente } = useLocalSearchParams();
  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const handleEditar = () => {
    router.push(`/profesional/${paciente}/plan/objetivo-editar?id=${actividad.id}`);
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
            .delete('/objetivos/detalle/'+actividad.id+'/')
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
    <TouchableOpacity onPress={() => setExpandido(!expandido)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {/* Ícono de categoría con color */}
          <Ionicons
            name="star"  // Puedes usar otro icono si quieres
            size={40}
            color="purple"
            style={{ width: 40, height: 40, marginRight: 12 }}
            aria-label={actividad.titulo}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{actividad.titulo}</Text>
            {/*<Text style={{ color: '#555' }}>{`Estado: ${actividad.estado}`}</Text>*/}
          </View>
        </View>
        
            <Ionicons
                name={expandido ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#555"
            />
       
      </View>
      
      {expandido && 
          <Text style={{ marginTop: 8, color: '#000' }}>{actividad.descripcion}</Text>

        }
    </TouchableOpacity> 
    </View>
    
    )};

const ListaActividades = ({ actividades, onChange }) => {
  return (
    <FlatList
      data={actividades}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ActividadItem actividad={item} onChange={onChange} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};

export default ListaActividades;