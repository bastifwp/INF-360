import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { TextoBloque } from "@/components/base/TextoBloque";

export function TarjetaPequeña({
  titulo,
  subtitulo,
  icono
}: TarjetaProps) {
  return (
    <View className="bg-lightgrey rounded-lg px-2 py-1 mb-1 flex-row items-center">
      {icono && <View className="mr-2">{icono}</View>}
      <View className="flex-1">
        <Text className="text-black text-base font-bold">{titulo}</Text>
        {subtitulo && (
          <Text className="text-mediumdarkgrey">{subtitulo}</Text>
        )}
      </View>
    </View>
  );
}

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

//TARJETA COMENTARIO 
interface TarjetaComentarioProps {
  autor: string;
  fecha: string;
  texto: string;
  icono?: React.ReactNode;
  expandidoContenido?: React.ReactNode;
}
export function TarjetaComentario({
  autor,
  fecha,
  texto,
  icono=<Ionicons name="person-circle-outline" size={40} color={colors.black}/>,
  expandidoContenido,
}: TarjetaComentarioProps) {
  const [expandido, setExpandido] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setExpandido(!expandido)}
      className="bg-lightgrey rounded-lg p-2 mb-4"
    >
      <View>
        <View className="flex-row items-center mb-2">
          {icono && <View className="mr-2">{icono}</View>}
          <View className="flex-1">
            <Text className="text-black font-bold text-base">{autor}</Text>
            <Text className="text-mediumdarkgrey text-xs">{fecha}</Text>
          </View>
          {expandidoContenido && (
            <Ionicons
              name={expandido ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.mediumdarkgrey}
            />
          )}
        </View>
        <TextoBloque texto={texto}/>
        {expandido && expandidoContenido && (
          <View className="mt-2">{expandidoContenido}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}

//TARJETA MENÚ
type iconoTipo = "log-out-outline" | "heart-circle-outline" | "people-outline" | "play-circle";
interface TarjetaMenuProps {
  titulo: string;
  iconoNombre: iconoTipo;
  onPress: () => void;
  fondoColor?: string;
  textoColor?: string;
  iconoColor?: string;
}
export function TarjetaMenu({
  titulo,
  iconoNombre,
  onPress,
  fondoColor=colors.light,
  textoColor=colors.black,
  iconoColor=colors.black
}: TarjetaMenuProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className="rounded-lg px-6 py-2 flex-row items-center"
        style={{ backgroundColor: fondoColor }}
      >
      <View className="mr-3">
        <Ionicons
          name={iconoNombre}
          size={24}
          color={iconoColor}
        />
      </View>
      <View className="flex-1">
        <Text
          className="text-base font-semibold"
          style={{ color: textoColor }}
        >
          {titulo}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  )
}

//TARJETA SELECTOR
interface TarjetaSelectorProps {
  titulo: string;
  subtitulo?: string[];
  onPress: () => void;
  icono?: React.ReactNode;
  iconoColor?: string;
  tarjetaEstilo?: string;
  tituloEstilo?: string;
  subtituloEstilo?: string;
}
export function TarjetaSelector({
  titulo,
  subtitulo,
  onPress,
  icono,
  iconoColor=colors.mediumdarkgrey,
  tarjetaEstilo="bg-lightgrey p-4 my-2",
  tituloEstilo="text-black text-lg font-bold",
  subtituloEstilo="text-mediumdarkgrey",
}: TarjetaSelectorProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-lg flex-row items-center ${tarjetaEstilo}`}
    >
      {icono && <View className="mr-2">{icono}</View>}
      <View className="flex-1">
        <Text className={`${tituloEstilo}`}>{titulo}</Text>
        {subtitulo && (
          <Text className={`text-base ${subtituloEstilo}`}>{subtitulo}</Text>
        )}
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={iconoColor}
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
  tarjetaEstilo?: string;
  tituloEstilo?: string;
  subtituloEstilo?: string;
  iconoColor?: string;
}
export function TarjetaExpandido({
  titulo,
  subtitulo = [],
  expandidoContenido,
  icono,
  expandidoDefecto = false,
  tarjetaEstilo="bg-lightgrey p-4 mb-4",
  tituloEstilo="text-black",
  subtituloEstilo="text-mediumdarkgrey",
  iconoColor=colors.mediumdarkgrey,
}: TarjetaExpandidoProps) {
  const [expandido, setExpandido] = useState(expandidoDefecto);
  return (
    <TouchableOpacity
      onPress={() => setExpandido(!expandido)}
      className={`rounded-lg ${tarjetaEstilo}`}
    >
      <View>
        <View className="flex-row items-center gap-1">
          {icono && <View className="mr-2">{icono}</View>}
          <View className="flex-1">
            <Text className={`text-lg font-bold ${tituloEstilo}`}>{titulo}</Text>
            {subtitulo.map((linea, i) => (
              <Text key={i} className={`text-sm ${subtituloEstilo}`}>
                {linea}
              </Text>
            ))}
          </View>
          <Ionicons
            name={expandido ? "chevron-up" : "chevron-down"}
            size={20}
            color={iconoColor}
          />
        </View>
        {expandido && expandidoContenido && (
          <View className="mt-2">{expandidoContenido}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}