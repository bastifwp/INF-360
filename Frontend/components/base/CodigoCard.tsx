import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

type CodigoCardProps = {
  codigo: string;
};

export function CodigoCard({codigo}: CodigoCardProps) {
  const copiarAlPortapapeles = async () => {
    await Clipboard.setStringAsync(codigo);
    Alert.alert("Código copiado al portapapeles");
  };

  return (
    <View className="bg-gray-100 rounded-xl p-4 border border-mediumgrey">
      <Text className="text-sm text-gray-500 mb-2">Código generado</Text>

      <View className="flex-row items-center justify-between bg-white rounded-lg px-4 py-3 border border-gray-300">
        <Text className="text-lg font-mono text-gray-800">{codigo}</Text>

        <TouchableOpacity
          onPress={copiarAlPortapapeles}
          className="bg-primary px-3 py-1 rounded-lg"
        >
          <Text className="text-white font-semibold">Copiar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};