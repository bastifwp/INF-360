import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type iconoTipo = "mail-open-outline";
interface EtiquetaProps {
  texto: string;
  iconoNombre?: iconoTipo;
  fondoColor: string;
  colorTexto?: string;
}
export function Etiqueta({ texto, iconoNombre, fondoColor, colorTexto = "white" }: EtiquetaProps) {
  return (
    <View
      style={{ backgroundColor: fondoColor }}
      className="w-full rounded-full p-2 flex-row items-center justify-center gap-1"
    >
      {iconoNombre && (
        <Ionicons
          name={iconoNombre}
          size={20}
          color={colorTexto}
        />
      )}
      <Text style={{ color: colorTexto }} className="font-semibold">
        {texto}
      </Text>
    </View>
  );
}
