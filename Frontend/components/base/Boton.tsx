import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { CustomModal } from "@/components/base//Modal";

//BOTÓN
interface BotonProps {
  texto: string;
  onPress: () => void;
  tipo?: number;
  isLoading?: boolean;
}
const estilosPorTipo: Record<number, { boton: string; texto: string }> = {
  1: {
    boton: "w-full bg-primary rounded-lg py-3 my-2",
    texto: "text-white text-center font-semibold text-base",
  },
  2: {
    boton: "w-full bg-white rounded-lg border border-secondary py-3 my-2",
    texto: "text-secondary text-center font-semibold text-base",
  },
  3: {
    boton: "w-full bg-secondary rounded-xl py-3 my-2 items-center",
    texto: "text-white font-bold text-lg",
  },
};
export function Boton({ texto, onPress, tipo = 1, isLoading = false }: BotonProps) {
  const estilos = estilosPorTipo[tipo] || estilosPorTipo[1];
  const [dots, setDots] = useState("");
  useEffect(() => {
    if (!isLoading) {
      setDots("");
      return;
    }
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, [isLoading]);
  return (
    <TouchableOpacity
      onPress={isLoading ? undefined : onPress}
      disabled={isLoading}
      className={`${estilos.boton} ${isLoading ? "opacity-50" : "opacity-100"}`}
      activeOpacity={0.7}
    >
      <Text className={estilos.texto}>
        {isLoading ? `Cargando${dots}` : texto}
      </Text>
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
      className="flex-row items-center mb-2"
    >
      <View className="w-5 h-5 mr-2 rounded-full border border-gray-400 justify-center items-center">
        {selected && <View className="w-3 h-3 rounded-full bg-primary" />}
      </View>
      <Text className="text-gray-800">{label}</Text>
    </Pressable>
  );
}

// BOTÓN CHECKBOX
interface BotonCheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
}
export function BotonCheckbox({
  label,
  value,
  checked,
  onToggle,
}: BotonCheckboxProps) {
  return (
    <Pressable
      onPress={() => onToggle(value)}
      className="flex-row items-center"
    >
      <View className="w-5 h-5 mr-2 rounded border border-gray-400 justify-center items-center bg-white">
        {checked && (
          <Ionicons name="checkmark" size={14} color="white" style={{ backgroundColor: colors.primary, borderRadius: 2, padding: 1 }} />
        )}
      </View>
      <Text className="text-gray-800">{label}</Text>
    </Pressable>
  );
}

//BOTÓN ICONO
type IconType = "arrow-back" | "log-out-outline" | "close" | "menu" | "notifications-circle-outline"; // agrega más aquí
interface IconButtonProps {
  tipo: "izquierda" | "derecha";
  onPress: () => void;
  iconName: IconType;
  color?: string;
  size?: number;
  style?: object;
  accessibilityLabel?: string;
}
export function BotonEsquinaSuperior ({
  tipo,
  onPress,
  iconName,
  color="white",
  style,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        position: "absolute",
        top: 10,
        left: tipo === "izquierda" ? 16 : null,
        right: tipo === "derecha" ? 16: null,
        zIndex: 10
      }, style]}
      accessible={true}
      accessibilityLabel={accessibilityLabel ?? iconName}
    >
      <Ionicons name={iconName} size={40} color={color} />
    </TouchableOpacity>
  );
}

//BOTÓN AGREGAR
export function BotonAgregar({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      }}
    >
      <Ionicons name="add" size={40} color={colors.white} />
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
        <Ionicons name="refresh-circle" size={40} color={colors.mediumgrey} />
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

//BOTÓN BUSCAR
type BotonBuscarProps = {
  onPress: () => void;
};
export function BotonBuscar({ onPress }: BotonBuscarProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel="Recargar contenido"
    >
      <Ionicons name="search-circle" size={40} color={colors.mediumgrey} />
    </TouchableOpacity>
  );
}

//BOTÓN ACCIÓN
type iconoTipo = "create-outline" | "trash-outline" | "person-remove" | "person-remove-outline" | "information-circle" | "chatbox-ellipses" | "unlink" |"alert-circle" | "person-add" |"mail-open";
interface BotonAccionProps {
  texto?: string;
  onPress: () => void;
  iconoNombre: iconoTipo;
  iconoColor: string;
  fondoColor: string;
  textoColor?: string;
  textoSize?: number;
  small?: boolean; // 👈 nuevo
}
// BOTÓN ACCIÓN
export function BotonAccion({
  texto,
  onPress,
  iconoNombre,
  iconoColor,
  fondoColor,
  textoColor = colors.black,
  textoSize = 10,
  small = false,
}: BotonAccionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      // 👇 quita flex-1 cuando small
      className={`rounded-lg p-2 flex-row items-center justify-center ${small ? "" : "flex-1"}`}
      style={[
        {
          backgroundColor: fondoColor,
          position: "relative",
          minHeight: 30,
        },
        // 👇 si small, fija tamaño; si no, que se expanda
        small
          ? { width: "25%", flexGrow: 0, flexShrink: 0 } // también puedes usar flexBasis: "25%"
          : { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
      ]}
    >
      <View className="flex-columns items-center justify-center">
        <Ionicons name={iconoNombre} size={24} color={iconoColor} />
        {texto && (
          <Text className="text-center font-semibold ml-1" style={{ color: textoColor, fontSize: textoSize }}>
            {texto}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

interface BotonDetallesProps {
  texto?: string;
  children: React.ReactNode;
  tipoModal?: "0" | "1";
  onOpen?: () => void; // 👈 nuevo
  small?: boolean; // 👈 nuevo
}

export function BotonDetalles({
  texto = "Detalles",
  children,
  tipoModal = "1",
  onOpen, // 👈 recibe callback
  small=false,
}: BotonDetallesProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (onOpen) onOpen(); // 👈 dispara el fetch cuando se abre
  };

  return (
    <>
      <BotonAccion
        texto={texto}
        onPress={handleOpen} // 👈 usamos handleOpen
        iconoNombre={"information-circle"}
        iconoColor={colors.mediumblue}
        fondoColor={colors.lightblue}
        small={small}
      />
      <CustomModal visible={open} onClose={() => setOpen(false)} tipo={tipoModal}>
        <View className="flex-1 p-2 gap-4 justify-center">
          <Text className="text-primary text-xl font-bold">
            Detalles
          </Text>
          <ScrollView>
            {children}
          </ScrollView>
        </View>
      </CustomModal>
    </>
  );
}

//BOTÓN EDITAR
interface BotonEditarProps {
  texto?: string;
  onPress: () => void;
}
export function BotonEditar({
  texto="Editar",
  onPress
}: BotonEditarProps) {
  return (
    <BotonAccion
      texto={texto}
      onPress={onPress}
      iconoNombre={"create-outline"}
      iconoColor={colors.mediumgreen}
      fondoColor={colors.lightgreen}
    />
  );
}

//BOTÓN VINCULAR
interface BotonVincularProps {
  texto?: string;
  onPress: () => void;
}
export function BotonVincular({
  texto="Vincularse",
  onPress,
}: BotonVincularProps) {
  return (
    <BotonAccion
      texto={texto}
      onPress={onPress}
      iconoNombre={"person-add"}
      iconoColor={colors.mediumgreen}
      fondoColor={colors.lightgreen}
    />
  );
}

//BOTÓN DESVINCULAR
interface BotonDesvincularProps {
  texto?: string;
  onPress: () => void;
}
export function BotonDesvincular({
  texto="Desvincularse",
  onPress,
}: BotonDesvincularProps) {
  return (
    <BotonAccion
      texto={texto}
      onPress={onPress}
      iconoNombre={"person-remove"}
      iconoColor={colors.mediumred}
      fondoColor={colors.lightred}
      textoSize={9}
    />
  );
}

//BOTÓN ELIMINAR 
interface BotonEliminarProps {
  texto?: string;
  onPress: () => void;
}
export function BotonEliminar({
  texto="Eliminar",
  onPress
}: BotonEliminarProps) {
  return (
    <BotonAccion
      texto={texto}
      onPress={onPress}
      iconoNombre={"trash-outline"}
      iconoColor={colors.mediumred}
      fondoColor={colors.lightred}
    />
  );
}