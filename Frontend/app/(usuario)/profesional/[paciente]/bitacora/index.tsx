import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";

import ListaEntradas from "../../../../components/profesional/ListaEntradas"



const Bitacora = () => {
  const router = useRouter();
  const { paciente } = useLocalSearchParams(); // o mejor usa useParams si paciente es path param

  const handleAgregar = () => {
    console.log('Agregar entrada pulsado')
    console.log("Paciente:", paciente);
    router.push(`/profesional/${paciente}/bitacora/entrada-agregar`);
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Bitácora</Text>

      {/* Solo la lista */}
      <View className="flex-1">
        <ListaEntradas/>
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