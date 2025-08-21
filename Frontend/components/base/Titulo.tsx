import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { BotonBuscar, BotonRecargar } from "@/components/base/Boton";
import { colors } from "@/constants/colors";
import { Buscador } from "@/components/base/Buscador";

//TÍTULO SECCIÓN
interface TituloSeccionProps {
  children: string;
  respuesta?: string;
  textoColor?: string;
  respuestaColor?: string;
  textoClassName?: string;
  respuestaClassName?: string;
}
export function TituloSeccion ({
  children,
  respuesta,
  textoClassName="text-black text-base",
  respuestaClassName="text-black text-base",
}: TituloSeccionProps) {
  return (
    <View className="flex-row flex-wrap">
      <Text className={`font-semibold ${textoClassName}`}>
        {children}
        {respuesta && <Text className={`font-normal ${respuestaClassName}`}>{` ${respuesta}`}</Text>}
      </Text>
    </View>
  );
}

//TÍTULO
interface TituloProps {
  children: string;
  subtitulo?: string;
  onPressRecargar?: () => void;
  onBusquedaChange?: (texto: string) => void;
}
export function Titulo({ children, subtitulo, onPressRecargar, onBusquedaChange }: TituloProps) {
  //ESTADOS
  const [busqueda, setBusqueda] = useState("");
  const [showBuscador, setShowBuscador] = useState(false);
  const toggleBuscador = () => setShowBuscador(v => !v);
  //HANDLE: BUSQUEDA
  const handleBusquedaChange = (texto: string) => {
    setBusqueda(texto);
    if (onBusquedaChange) onBusquedaChange(texto);
  };
  //VISTA
  return (
    <View className="mb-1">
      <View className="w-full flex-row items-center justify-between">
        {onBusquedaChange ? (
          <BotonBuscar onPress={toggleBuscador}/>
        ) : (
          <Ionicons name="ellipse" size={40} color={colors.light}/>
        )}
        {subtitulo ? (
          <View className="flex-columns">
            <Text className="text-2xl text-primary font-bold text-center px-2 pt-2">
              {children}
            </Text>
            <Text className="text-sm text-primary font-bold text-center px-2 pb-2">
              {subtitulo}
            </Text>
          </View>
        ) : (
          <Text className="text-2xl text-primary font-bold text-center p-2">
            {children}
          </Text>
        )}
        {onPressRecargar ? (
          <BotonRecargar onPress={onPressRecargar} />
        ) : (
          <Ionicons name="ellipse" size={40} color={colors.light}/>
        )}
      </View>
      {showBuscador && (
        <Buscador
          busqueda={busqueda}
          setBusqueda={handleBusquedaChange}
          placeholder="Buscar..."
        />
      )}
    </View>
  );
}