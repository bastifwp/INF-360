import React from 'react';
import { Text, TextInput, View } from "react-native"; 
import { colores } from "@/constants/colores";

const estilosPorTipo: Record<
  number,
  {
    container: string;
    label: string;
    input: string;
    placeholderColor: string;
  }
> = {
  1: {
    container: "w-full mb-2",
    label: "text-primary font-semibold mb-2",
    input: "border border-primary rounded-xl text-start px-4 mb-1",
    placeholderColor: colores.mediumgrey,
  },
  2: {
    container: "w-full mb-2",
    label: "text-black font-semibold mb-2",
    input: "border border-mediumgrey rounded-xl text-start px-4 mb-1",
    placeholderColor: colores.mediumdarkgrey,
  },
};

interface CampoFormularioProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  tipo?: number;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormularioCampo({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  tipo = 1,
  maxLength,
  multiline = false,
  numberOfLines,
}: CampoFormularioProps) {
  const estilos = estilosPorTipo[tipo] || estilosPorTipo[1];

  return (
    <View className={estilos.container}>
      {label ? <Text className={estilos.label}>{label}</Text> : null}
      <TextInput
        className={estilos.input}
        placeholder={placeholder}
        placeholderTextColor={estilos.placeholderColor}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "auto"}
      />
    </View>
  );
}