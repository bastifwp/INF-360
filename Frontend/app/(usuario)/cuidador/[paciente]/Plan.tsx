import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from "expo-router";

import ListaObjetivos from "../../../components/cuidador/ListaObjetivos"

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

//También se pueden crear estructuras para que sean listas de estructuras, donde se defina el objetivo asociado
const metas: string[] = []
const actividades: string[] = []

const Plan = () => {

  const router = useRouter();
  const { paciente } = useLocalSearchParams();
  const [pestanaActiva, setPestanaActiva] = useState<'objetivos' | 'metas' | 'actividades'>('objetivos')

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
                  Aún no tienes objetivos en tu plan de trabajo.
                </Text>
              </View>
            ) : (
              <ListaObjetivos objetivos={objetivos} />
            )}
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
              <ListaObjetivos objetivos={metas} />
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
              <ListaObjetivos objetivos={actividades} />
            )}
          </>
        )}

      </View>

    </View>
  )
}

export default Plan
