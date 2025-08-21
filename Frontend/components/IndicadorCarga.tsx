import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colores } from "@/constants/colores";

interface IndicadorCargaProps {
  color?: string;
  tamaño?: "small" | "large";
}
export function IndicadorCarga({color = colores.mediumdarkgrey, tamaño = "large" }: IndicadorCargaProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={tamaño} color={color} />
    </View>
  );
}