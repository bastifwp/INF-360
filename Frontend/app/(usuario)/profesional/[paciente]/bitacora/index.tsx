import React, {useState, useEffect} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";

import { useAuth } from '@/app/context/auth';

import ListaEntradas from "../../../../components/profesional/ListaEntradas"

// ✅ Lista de entradas ejemplo con selectedObj como lista de objetos
/*
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
*/

const Bitacora = () => {

  const router = useRouter();
  const { paciente } = useLocalSearchParams();
  const [entradas, setEntradas] = useState([]);
  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();
  const [id, encodedNombre] = paciente?.split("-") ?? [null, null];

  useEffect(() => {
  
    if (!authToken || !refreshToken) return;

    const api = createApi(authToken, refreshToken, setAuthToken);

    api
        .get('/bitacora/'+id+'/')
        .then(res => setEntradas(res.data))
        .catch(err => console.log(err));
  },[authToken, refreshToken]); // 👈 se ejecuta cada vez que cambien

  const handleAgregar = () => {
    console.log('Agregar entrada pulsado')
    console.log("Paciente:", paciente);
    router.push(`/profesional/${paciente}/bitacora/entrada-agregar`);
  }

  return (
    <View className="flex-1">
      <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">Bitácora</Text>

      {/* Solo la lista */}
      <View className="flex-1">
        <ListaEntradas entradas={entradas}/>
      </View>

      {/* Botón flotante para agregar */}
      <TouchableOpacity
        onPress={handleAgregar}
        className="absolute bottom-6 right-6 bg-secondary rounded-full w-14 h-14 items-center justify-center shadow-lg"
      >
        <Text className="text-white text-xl">＋</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Bitacora