import { Text, View, Image } from "react-native";

import { icons } from "../../../../constants/icons";
import { useAuth } from "../../../context/auth";

export default function Inicio() {

  const { user } = useAuth();
  const primer_nombre = user.nombre.split(" ")[0];

  const items = [
    {
      icon: icons.plan,
      label: "Plan de trabajo",
      description: "Objetivos, metas y actividades terapéuticas",
    },
    {
      icon: icons.bitacora,
      label: "Bitácora",
      description: "Registro de sesiones terapéuticas",
    },
    {
      icon: icons.chat,
      label: "Chat",
      description: "Comunicación con otros profesionales",
    },
  ];

  return (

    <View className="flex-1 items-center p-4">

      <Text className="text-3xl font-bold my-2 align-middle self-center color-primary">
        ¡Bienvenid@, {primer_nombre}!
      </Text>

      <Text className="text-base mb-6">
        Aquí tienes una guía rápida para comenzar a usar la aplicación:
      </Text>

      <View className="w-full">
        {items.map((item, index) => (
          <View key={index} className="flex-row items-start mb-4">
            <Image source={item.icon} style={{ width: 28, height: 28, marginRight: 12 }} />
            <View>
              <Text className="text-base font-semibold">{item.label}</Text>
              <Text className="text-sm text-gray-500">{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
      
    </View>

  );

}
