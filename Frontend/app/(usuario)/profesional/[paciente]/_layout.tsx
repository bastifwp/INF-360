import React from "react";
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from "react-native";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";

import Footer from "../../../components/profesional/Footer"

export default function LayoutPaciente() {

  const router = useRouter();
  const { paciente } = useLocalSearchParams();
  const [id, encodedNombre] = paciente?.split("-") ?? [null, null];
  const nombre = encodedNombre ? decodeURIComponent(encodedNombre) : null;

  const navegarSelectorPaciente = () => {
    router.push(`/profesional`)
  }

  return (

    <View className="flex-1 bg-white">
      
      {/* Barra Paciente */}
      <View className="bg-secondary flex-row justify-between items-center px-4 py-3">
        <Text className="text-white font-bold text-base">
          Paciente: {nombre}
        </Text>
        <TouchableOpacity
          onPress={navegarSelectorPaciente}
          className="bg-secondary rounded-full p-1 border border-white"
          activeOpacity={0.7}
        >
          <FontAwesome name="users" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-4 pb-24">
        <Slot />
      </View>
      <Footer />

    </View>

  );
};
