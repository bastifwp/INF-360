import React from "react";
import { View } from "react-native";
import { Titulo } from "@/components/Titulo";
import { MensajeVacio } from "@/components/MensajeVacio";

//BÁSICAMENTE COPIAR CÓDIGO DE ENTRADA-AGREGAR U OBJETIVO-AGREGAR Y ADAPTARLO :)
  
export default function EquipoAgregar() {
  return (
    <View className="flex-1">
      <Titulo>Agregar profesional</Titulo>
      <MensajeVacio mensaje={`En construcción...`}/>
    </View>
  )
}