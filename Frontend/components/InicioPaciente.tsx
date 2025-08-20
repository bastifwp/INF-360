import React from "react";
import { usePathname } from "expo-router";
import { Image, Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { icons } from "@/constants/icons";
import { Titulo } from "@/components/Titulo";
import { Tarjeta } from "@/components/Tarjeta";

export function InicioPaciente() {

  const { user } = useAuth();
  const primer_nombre = user.nombre.split(" ")[0];

  const pathname = usePathname();
  const isProfesional = pathname.includes("/profesional");

  const items = isProfesional
    ? [
        { icon: icons.plan, label: "Plan de trabajo", description: "Objetivos, metas y actividades terapéuticas" },
        { icon: icons.bitacora, label: "Bitácora", description: "Registro de sesiones terapéuticas" },
        { icon: icons.chat, label: "Chat", description: "Comunicación con otros profesionales" },
      ]
    : [
        { icon: icons.plan, label: "Plan de trabajo", description: "Objetivos, metas y actividades terapéuticas" },
        { icon: icons.bitacora, label: "Recomendaciones", description: "Recomendaciones entregadas por profesionales" },
      ];

  return (

    <View className="flex-1">

      <Titulo>{`¡Bienvenid@, ${primer_nombre}!`}</Titulo>

      <Text className="text-base pb-2">
        Aquí tienes una guía rápida para comenzar a usar la aplicación:
      </Text>

      <View className="w-full">
        {items.map((item, index) => (
          <Tarjeta
            key={index}
            titulo={item.label}
            subtitulo={[item.description]}
            icono={
              <Image source={item.icon} style={{ width: 40, height: 40, marginRight: 12 }} />
            }
          />
        ))}
      </View>
      
    </View>

  );

}
