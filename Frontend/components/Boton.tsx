import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colores } from "@/constants/colores";

//BOTÓN
interface BotonProps {
  texto: string;
  onPress: () => void;
  tipo?: number;
}
const estilosPorTipo: Record<number, { boton: string; texto: string }> = {
  1: {
    boton: "w-full bg-primary py-4 rounded-lg mt-4 mb-4",
    texto: "text-white text-center font-semibold text-base",
  },
  2: {
    boton: "w-full bg-white border border-secondary py-4 rounded-lg mb-4",
    texto: "text-secondary text-center font-semibold text-base",
  },
  3: {
    boton: "w-full bg-secondary rounded-xl py-3 mt-2 mb-6 items-center",
    texto: "text-white font-bold text-lg",
  },
};
export function Boton({ texto, onPress, tipo = 1 }: BotonProps) {
  const estilos = estilosPorTipo[tipo] || estilosPorTipo[1];
  return (
    <TouchableOpacity onPress={onPress} className={estilos.boton}>
      <Text className={estilos.texto}>{texto}</Text>
    </TouchableOpacity>
  );
}

//BOTÓN RADIO
interface BotonRadioProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}
export function BotonRadio({
  label,
  value,
  selected,
  onSelect,
}: BotonRadioProps) {
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className="flex-row items-center mb-4"
    >
      <View className="w-5 h-5 mr-2 rounded-full border border-gray-400 justify-center items-center">
        {selected && <View className="w-3 h-3 rounded-full bg-primary" />}
      </View>
      <Text className="text-gray-800">{label}</Text>
    </Pressable>
  );
}

//BOTÓN ICONO
type IconType = "arrow-back" | "log-out-outline" | "close" | "menu"; // agrega más aquí
interface IconButtonProps {
  onPress: () => void;
  iconName: IconType; // solo los tipos definidos
  color?: string;
  size?: number;
  style?: object;
  accessibilityLabel?: string;
}
export function BotonEsquinaSuperiorIzquierda ({
  onPress,
  iconName,
  color="white",
  style,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ position: "absolute", top: 20, left: 20, zIndex: 10 }, style]}
      accessible={true}
      accessibilityLabel={accessibilityLabel ?? iconName}
    >
      <Ionicons name={iconName} size={32} color={color} />
    </TouchableOpacity>
  );
}

//BOTÓN AGREGAR
export function BotonAgregar({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-secondary rounded-full w-14 h-14 items-center justify-center shadow-lg absolute"
      style={{
        bottom: 20,
        right: 20
      }}
      accessibilityLabel="Agregar contenido"
    >
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>
  );
}

//BOTÓN RECARGAR
type BotonRecargarProps = {
  onPress: () => void;
  tipo?: number;
};
export function BotonRecargar({ onPress, tipo = 1 }: BotonRecargarProps) {
  if (tipo === 1) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessibilityLabel="Recargar contenido"
      >
        <Ionicons name="reload" size={24} color={colores.secondary} />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-secondary rounded-lg p-2 my-2 flex-row items-center justify-center"
      accessibilityLabel="Intentar nuevamente"
    >
      <Ionicons name="reload" size={24} color="white" style={{ marginRight: 4 }} />
      <Text className="text-white font-bold text-base">Intentar nuevamente</Text>
    </TouchableOpacity>
  );
}

//BOTÓN EDITAR
interface BotonEditarProps {
  tipo: string;
  onPress: () => void;
}
export function BotonEditar({ tipo, onPress }: BotonEditarProps) {
  const texto = `Editar ${tipo}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg px-4 py-2 flex-row items-center"
      style={{ backgroundColor: colores.lightgreen }}
    >
      <Ionicons
        name="create-outline"
        size={20}
        color={colores.mediumgreen} />
      <Text className="text-black font-semibold ml-2">{texto}</Text>
    </TouchableOpacity>
  );
}

//BOTÓN ELIMINAR 
interface BotonEliminarProps {
  tipo: string;
  onPress: () => void;
}
export function BotonEliminar({ tipo, onPress }: BotonEliminarProps) {
  const texto = `Eliminar ${tipo}`;
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg px-4 py-2 flex-row items-center"
      style={{ backgroundColor: colores.lightred }}
    >
      <Ionicons
        name="trash-outline"
        size={20}
        color={colores.mediumred} />
      <Text className="text-black font-semibold ml-2">{texto}</Text>
    </TouchableOpacity>
  );
}