import { Text, View } from "react-native";
import { BotonRecargar } from "@/components/Boton";

interface TituloProps {
  children: string;
}
export function Titulo ({ children }: TituloProps) {
  return (
    <Text className="text-2xl text-primary font-bold text-center p-2">
      {children}
    </Text>
  );
}

export function TituloSeccion ({ children }: TituloProps) {
  return (
    <Text className="text-black font-semibold mb-2">
      {children}
    </Text>
  );
}

interface TituloRecargarProps extends TituloProps {
  onPress: () => void;
}
export function TituloRecargar({ children, onPress }: TituloRecargarProps) {
  return (
    <View className="w-full flex-row items-center justify-center">
      <Titulo>{children}</Titulo>
      <BotonRecargar onPress={onPress} />
    </View>
  );
}