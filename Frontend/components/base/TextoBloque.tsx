import React from "react";
import { Text, View } from "react-native";

interface TextoBloqueProps {
  texto: string;
}

export function TextoBloque({ texto }: TextoBloqueProps) {
  return (
    <View className="bg-light rounded-lg p-2">
      <Text className="text-black">{texto}</Text>
    </View>
  );
}