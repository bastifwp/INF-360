import { Text, View } from "react-native";
import { BotonRecargar } from "@/components/Boton";

type MensajeVacioProps = {
  mensaje: string;
  children?: React.ReactNode;
  recargar?: boolean;
  onPress?: () => void;
};

export function MensajeVacio({ mensaje, children, recargar, onPress }: MensajeVacioProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-mediumdarkgrey text-center text-base">{mensaje}</Text>
      {children}
      {recargar && onPress && (
        <BotonRecargar
          tipo={2}
          onPress={onPress}
        />
      )}
    </View>
  );
}