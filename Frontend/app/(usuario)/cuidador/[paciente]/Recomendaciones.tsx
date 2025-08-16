import React from "react";
import { View } from "react-native";
import { Titulo } from "@/components/base/Titulo";
import { MensajeVacio } from "@/components/base/MensajeVacio";
  
export default function Recomendaciones() {
  return (
    <View className="flex-1">
      <Titulo>Recomendaciones</Titulo>
      <MensajeVacio mensaje={`En construcción...`}/>
    </View>
  )
}