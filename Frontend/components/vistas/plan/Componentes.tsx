import React from "react";
import { Text, View } from "react-native";
import { BotonCheckbox } from "@/components/base/Boton";

//FILTRO: ACTIVO - INACTIVO
interface Filtro {
  label: string
  value: string
  checked: boolean
  onToggle: () => void
}
interface FiltrosProps {
  filtros: Filtro[]
}
export function FiltroActivoInactivo({ filtros }: FiltrosProps) {
  return (
    <View className="bg-lightgrey rounded-lg px-4 py-2 mb-2 flex-row items-center justify-between">
      {filtros.map((filtro) => (
        <BotonCheckbox
          key={filtro.value}
          label={filtro.label}
          value={filtro.value}
          checked={filtro.checked}
          onToggle={filtro.onToggle}
        />
      ))}
    </View>
  );
}

//BADGE: OBJETIVO
interface ObjetivoBadgeProps {
  fondoColor: string;
  texto: string;
  textoColor: string;
}
export function ObjetivoBadge({
  fondoColor,
  texto,
  textoColor,
}: ObjetivoBadgeProps) {
  return (
    <View
      className="rounded-bl-lg px-2 py-1 absolute top-0 right-0 z-10"
      style={{ backgroundColor: fondoColor }}
    >
      <Text className="text-xs font-bold"
        style={{ color: textoColor }}
      >
          {texto}
      </Text>
    </View>
  );
}