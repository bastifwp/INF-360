import React from "react";
import { Text, View } from "react-native";

interface EtiquetaProps {
  texto: string;
  colorFondo: string;
  colorTexto?: string;
}

export function Etiqueta({ texto, colorFondo, colorTexto = "white" }: EtiquetaProps) {
  return (
    <View
      style={{ backgroundColor: colorFondo }}
      className="w-full rounded-full p-2 mb-2 items-center"
    >
      <Text style={{ color: colorTexto }} className="font-semibold">
        {texto}
      </Text>
    </View>
  );
}
