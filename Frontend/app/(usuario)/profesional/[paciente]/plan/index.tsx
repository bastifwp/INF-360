import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAuth } from '@/app/context/auth';
import ListaObjetivos from "../../../../components/profesional/ListaObjetivos"
import ListaMetas from '@/app/components/profesional/ListaMetas';

/*
const objetivos = [
  {
    id: '1',
    titulo: 'Mejorar comunicación',
    descripcion: 'Incrementar la interacción social y el lenguaje funcional en el niño.',
    categoria: 'Comunicación',
    autor_creacion: 'Dr. Smith',
    fecha_creacion: '2025-05-01',
    autor_modificacion: 'Dr. Smith',
    fecha_modificacion: '2025-05-01',
  }
]
*/
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

const actividades = []

const Plan = () => {

  const router = useRouter();
  const { paciente } = useLocalSearchParams();

  const [pestanaActiva, setPestanaActiva] = useState<'objetivos' | 'metas' | 'actividades'>('objetivos')
  const [objetivos, setObjetivos] = useState([]);

  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const [id, encodedNombre] = paciente?.split("-") ?? [null, null];

  
  useEffect(() => {
  
    if (!authToken || !refreshToken) return;

    const api = createApi(authToken, refreshToken, setAuthToken);

    api
        .get('/objetivos/'+id+'/')
        .then(res => setObjetivos(res.data))
        .catch(err => console.log(err));
  },[authToken, refreshToken]); // 👈 se ejecuta cada vez que cambien
  

  const fetchObjetivos = () => {
    if (!authToken || !refreshToken) return;

    const api = createApi(authToken, refreshToken, setAuthToken);

    api
      .get('/objetivos/'+id+'/')
      .then(res => setObjetivos(res.data))
      .catch(err => {console.log(err); Alert.alert("Error", "Error al cargar plan de trabajo")});
    };

  //fetchObjetivos()

  const handleAgregar = () => {
    console.log('[./app/(usuario)/profesional/[paciente]/plan/index.tsx] Agregando objetivo...')
    router.push(`/profesional/${paciente}/plan/objetivo-agregar`);
  }

  return (
    <View className="flex-1">
      <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">Plan de trabajo</Text>

      {/* Barra de pestañas */}
      <View className="flex-row mb-4">
        {['objetivos', 'metas', 'actividades'].map(pestana => (
          <TouchableOpacity
            key={pestana}
            onPress={() => setPestanaActiva(pestana as any)}
            className={`flex-1 py-3 mx-1 rounded-lg ${
              pestanaActiva === pestana ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <Text
              className={`text-center ${
                pestanaActiva === pestana ? 'text-white font-bold' : 'text-gray-700'
              } capitalize`}
            >
              {pestana}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido según pestaña */}
      <View className="flex-1">
        
        {/* Objetivos */}
        {pestanaActiva === 'objetivos' && (
          <>
            {objetivos.length === 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-lg text-gray-500">
                  Aún no tienes objetivos en tu plan de trabajo. Puedes agregar uno apretando el botón ＋.
                </Text>
              </View>
            ) : (
              <ListaObjetivos objetivos={objetivos} onChange={fetchObjetivos}/>
            )}
            <TouchableOpacity
              onPress={handleAgregar}
              className="absolute bottom-6 right-6 bg-secondary rounded-full w-14 h-14 items-center justify-center shadow-lg"
            >
              <Text className="text-white text-xl">＋</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Metas */}
        {pestanaActiva === 'metas' && (
          <>
            {metas.length === 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-lg text-gray-500">
                  Aún no tienes metas en tu plan de trabajo.
                </Text>
              </View>
            ) : (
              <ListaMetas metas={metas} onChange={fetchObjetivos}/>
            )}
          </>
        )}

        {/* Actividades */}
        {pestanaActiva === 'actividades' && (
          <>
            {actividades.length === 0 ? (
              <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-lg text-gray-500">
                  Aún no tienes actividades en tu plan de trabajo.
                </Text>
              </View>
            ) : (
              <ListaObjetivos objetivos={actividades} onChange={fetchObjetivos}/>
            )}
          </>
        )}

      </View>

    </View>
  )
}

export default Plan
