import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";

import ListaObjetivos from "../../../components/cuidador/ListaObjetivos"

const Plan = () => {

  const router = useRouter();
  const { paciente } = useLocalSearchParams(); // Para conservar el ID dinámico

  const [pestanaActiva, setPestanaActiva] = useState<'objetivos' | 'metas' | 'actividades'>('objetivos')

  const handleAgregar = () => {
    console.log('Agregar objetivo pulsado')
    console.log("Paciente:", paciente);
    router.push(`/profesional/${paciente}/plan/objetivo-agregar`);
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Plan de trabajo</Text>

      {/* Barra de pestañas */}
      <View className="flex-row mb-4">
        {['objetivos', 'metas', 'actividades'].map(pestana => (
          <TouchableOpacity
            key={pestana}
            onPress={() => setPestanaActiva(pestana as any)}
            className={`flex-1 py-3 mx-1 rounded-lg ${
              pestanaActiva === pestana ? 'bg-blue-800' : 'bg-gray-300'
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
        {pestanaActiva === 'objetivos' && <ListaObjetivos />}
        {pestanaActiva === 'metas' && <Text>Aquí van las metas...</Text>}
        {pestanaActiva === 'actividades' && <Text>Aquí van las actividades...</Text>}
      </View>

      {pestanaActiva === 'objetivos' && (
        <>
          <TouchableOpacity
            onPress={handleAgregar}
            className="absolute bottom-6 right-6 bg-blue-600 rounded-full w-14 h-14 items-center justify-center shadow-lg"
          >
            <Text className="text-white text-xl">＋</Text>
          </TouchableOpacity>
        </>
                )}

    </View>
  )
}

export default Plan
