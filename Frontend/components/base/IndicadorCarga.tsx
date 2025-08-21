import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/constants/colors";

interface IndicadorCargaProps {
  color?: string;
  tamaño?: "small" | "large";
}
export function IndicadorCarga({color = colors.mediumdarkgrey, tamaño = "large" }: IndicadorCargaProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={tamaño} color={color} />
    </View>
  );
}