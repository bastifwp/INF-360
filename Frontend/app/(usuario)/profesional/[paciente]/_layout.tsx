import React from "react";
import { View } from "react-native";
import { Slot, useLocalSearchParams } from "expo-router";
import { Footer } from "@/components/layout/Footer";
import { HeaderPaciente } from "@/components/layout/Header";

export default function LayoutProfesionalPaciente() {

  const { paciente } = useLocalSearchParams();
  const [pacienteID, pacienteEncodedNombre] = paciente?.split("-") ?? [null, null];
  const pacienteNombre = pacienteEncodedNombre ? decodeURIComponent(pacienteEncodedNombre) : null;

  return (
    <View className="flex-1">
      {pacienteNombre && <HeaderPaciente nombre={pacienteNombre}/>}
      <View className="flex-1 px-4 py-2 pb-24">
        <Slot />
      </View>
      <Footer />
    </View>
  );
  
};
