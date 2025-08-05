import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colores } from "@/constants/colores";

//TARJETA
interface TarjetaProps {
  titulo: string;
  subtitulo?: string[];
  icono?: React.ReactNode;
}
export function Tarjeta({
  titulo,
  subtitulo,
  icono
}: TarjetaProps) {
  return (
    <View className="bg-lightgrey rounded-lg p-4 my-2 flex-row items-center">
      {icono && <View className="mr-3">{icono}</View>}
      <View className="flex-1">
        <Text className="text-black text-lg font-bold">{titulo}</Text>
        {subtitulo && (
          <Text className="text-mediumdarkgrey">{subtitulo}</Text>
        )}
      </View>
    </View>
  );
}

//TARJETA MENÚ
type iconoTipo = "log-out-outline" | "heart-circle-outline" | "people-outline";
interface TarjetaMenuProps {
  titulo: string;
  iconoNombre: iconoTipo;
  onPress: () => void;
}
export function TarjetaMenu({
  titulo,
  iconoNombre,
  onPress,
}: TarjetaMenuProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-lightgrey rounded-lg px-6 py-4 my-2 flex-row items-center">
      <View className="mr-3">
        <Ionicons
          name={iconoNombre}
          size={24}
          color="black"
        />
      </View>
      <View className="flex-1">
        <Text className="text-black text-lg font-semibold">{titulo}</Text>
      </View>
    </View>
    </TouchableOpacity>
  )
}

//TARJETA SELECTOR
interface TarjetaSelectorProps {
  titulo: string;
  subtitulo?: string;
  onPress: () => void;
  icono?: React.ReactNode;
}
export function TarjetaSelector({
  titulo,
  subtitulo,
  onPress,
  icono
}: TarjetaSelectorProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-lightgrey rounded-lg p-4 my-2 flex-row items-center"
    >
      {icono && <View className="mr-3">{icono}</View>}
      <View className="flex-1">
        <Text className="text-black text-lg font-bold">{titulo}</Text>
        {subtitulo && (
          <Text className="text-mediumdarkgrey">{subtitulo}</Text>
        )}
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={colores.mediumdarkgrey}
      />
    </TouchableOpacity>
  );
}

//TARJETA EXPANDIDO
interface TarjetaExpandidoProps {
  titulo: string;
  subtitulo?: string[];
  expandidoContenido?: React.ReactNode;
  icono?: React.ReactNode;
  expandidoDefecto?: boolean;
}
export function TarjetaExpandido({
  titulo,
  subtitulo = [],
  expandidoContenido,
  icono,
  expandidoDefecto = false,
}: TarjetaExpandidoProps) {
  const [expandido, setExpandido] = useState(expandidoDefecto);
  return (
    <TouchableOpacity
      onPress={() => setExpandido(!expandido)}
      className="bg-lightgrey rounded-lg p-4 mb-4"
    >
      <View>
        <View className="flex-row items-center">
          {icono && <View className="mr-2">{icono}</View>}
          <View className="flex-1">
            <Text className="text-black text-lg font-bold">{titulo}</Text>
            {subtitulo.map((linea, i) => (
              <Text key={i} className="text-mediumdarkgrey">
                {linea}
              </Text>
            ))}
          </View>
          <Ionicons
            name={expandido ? "chevron-up" : "chevron-down"}
            size={20}
            color={colores.mediumdarkgrey}
          />
        </View>
        {expandido && expandidoContenido && (
          <View className="mt-2">{expandidoContenido}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}