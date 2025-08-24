import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { colores } from "@/constants/colores";
import { useDescartarCambios } from "@/context/DescartarCambios";

function usarDescartarCambios(pathname: string): boolean {
  return pathname.includes("/objetivo") || pathname.includes("/entrada");
}

const FooterItem = ({ icon, label, isActive, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityLabel={`Ir a ${label}`}
    className="flex-1 items-center justify-center"
  >
    <Image
      source={icon}
      className="w-[24px] h-[24px] mt-[12px]"
      style={{ tintColor: isActive ? colores.white : colores.mediumgrey }}
    />
    <Text
      className="my-[9px] text-xs"
      style={{ color: isActive ? colores.white : colores.mediumgrey }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export function Footer() {

  const { handleDescartarCambios } = useDescartarCambios();

  const router = useRouter();

  const { paciente } = useLocalSearchParams();

  const pathname = usePathname();
  const isCuidador = pathname.includes("/cuidador");
  const isProfesional = pathname.includes("/profesional");
  if (!paciente || (!isProfesional && !isCuidador)) return null;

  const items = isProfesional
    ? [
        { route: `/profesional/${paciente}`, icon: icons.inicio, label: "Inicio" },
        { route: `/profesional/${paciente}/plan`, icon: icons.plan, label: "Plan" },
        { route: `/profesional/${paciente}/bitacora`, icon: icons.bitacora, label: "Bitácora" },
        { route: `/profesional/${paciente}/chat`, icon: icons.chat, label: "Chat" },
      ]
    : [
        { route: `/cuidador/${paciente}`, icon: icons.inicio, label: "Inicio" },
        { route: `/cuidador/${paciente}/plan`, icon: icons.plan, label: "Plan" },
        { route: `/cuidador/${paciente}/recomendaciones`, icon: icons.bitacora, label: "Recomendaciones" }
      ];

  return (

    <View className="bg-primary rounded-xl mx-4 mb-4 h-[70px] absolute bottom-0 left-0 right-0 flex-row">

      {items.map((item) => {
        const isActive =
          item.label === "Inicio"
            ? pathname === item.route
            : pathname === item.route || pathname.startsWith(item.route + "/");
        return (
          <FooterItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            isActive={isActive}
            onPress={() => {
              if (handleDescartarCambios && usarDescartarCambios(pathname)) {
                handleDescartarCambios(item.route);
              } else {
                router.replace(item.route);
              }
            }}
          />
        );
      })}

    </View>

  );

}