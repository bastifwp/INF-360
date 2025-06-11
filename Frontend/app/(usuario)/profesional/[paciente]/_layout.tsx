import React from "react";
import { View, Text } from "react-native";
import { Slot, useLocalSearchParams } from "expo-router";

import Footer from "../../../components/profesional/Footer"

export default function LayoutPaciente() {
  const { paciente } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      <View className="bg-secondary px-4 py-3">
        <Text className="text-white font-bold text-base">
          Paciente: {paciente ?? "Sin paciente seleccionado"}
        </Text>
      </View>
      <View className="flex-1 pb-24">
        <Slot />
      </View>
      <Footer/>
    </View>
  );
};
