import { Text, View } from "react-native";
import { BotonRecargar } from "@/components/base/Boton";

type MensajeVacioProps = {
  mensaje: string;
  children?: React.ReactNode;
  onPressRecargar?: () => void;
};

export function MensajeVacio({ mensaje, children, onPressRecargar }: MensajeVacioProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-mediumdarkgrey text-center text-base">{mensaje}</Text>
      {children}
      {onPressRecargar && (
        <BotonRecargar
          tipo={2}
          onPress={onPressRecargar}
        />
      )}
    </View>
  );
}