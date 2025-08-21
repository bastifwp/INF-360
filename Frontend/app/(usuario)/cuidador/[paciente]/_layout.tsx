import React from "react";
import { View } from "react-native";
import { Slot, useLocalSearchParams } from "expo-router";
import { Footer } from "@/components/layout/Footer";
import { HeaderPaciente } from "@/components/layout/Header";

export default function LayoutCuidadorPaciente() {

  const { paciente } = useLocalSearchParams();
  const [pacienteID, pacienteEncodedNombre] = paciente?.split("-") ?? [null, null];
  const pacienteNombre = pacienteEncodedNombre ? decodeURIComponent(pacienteEncodedNombre) : null;

  return (
    <View className="flex-1">
      <HeaderPaciente nombre={pacienteNombre} />
      <View className="flex-1 p-4 pb-24">
        <Slot />
      </View>
      <Footer />
    </View>
  );

};
