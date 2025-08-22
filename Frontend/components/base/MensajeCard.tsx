import React from "react";
import { View, Text, StyleSheet } from "react-native";

type MensajeCardProps = {
  titulo: string;
  mensajes: string[];
  onPressRecargar?: () => void;
};

export function MensajeCard({ titulo, mensajes }: MensajeCardProps) {
  return (
    <View className="bg-yellow-100 rounded-xl p-4 shadow-lg mb-5 mt-2">
      <Text className="text-lg font-bold text-gray-800 mb-3">{titulo}</Text>

      {mensajes.map((linea: string, index: number) => (
        <Text key={index} className="text-base text-gray-600 mb-2">
          • {linea}
        </Text>
      ))}
    </View>
  );
};



export default MensajeCard;
