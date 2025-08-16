import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { Image, FlatList, View } from "react-native";
import { useAuth } from "@/context/auth";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/colors";
import { Titulo } from "@/components/base/Titulo";
import { Buscador } from "@/components/base/Buscador";
import { TarjetaSelector } from "@/components/base/Tarjeta";

export function InicioPaciente() {

  const router = useRouter();

  const { user } = useAuth();
  const primer_nombre = user?.nombre.split(" ")[0];
  const isProfesional = user?.role === "profesional";

  const ruta = decodeURIComponent(usePathname());
  if (!ruta) return null;
  const ruta_partes = ruta.split("/").filter(Boolean);
  const rol = ruta_partes[0];
  const paciente = ruta_partes[1];

  //ESTADOS
  const [busqueda, setBusqueda] = useState("");

  const items = isProfesional
    ? [
        {
          icon: icons.plan,
          label: "Plan de trabajo",
          description: "Objetivos generales y específicos",
          ruta: `/${rol}/${paciente}/plan`,
        },
        {
          icon: icons.bitacora,
          label: "Bitácora",
          description: "Registro de sesiones terapéuticas",
          ruta: `/${rol}/${paciente}/bitacora`,
        },
        {
          icon: icons.chat,
          label: "Chat",
          description: "Comunicación con otros profesionales",
          ruta: `/${rol}/${paciente}/chat`,
        },
        {
          icon: <Ionicons name={"people-outline"} size={50} color={colors.black}/>,
          label: "Equipo",
          description: "Visualización del equipo de trabajo",
          ruta: `/${rol}/${paciente}/equipo`,
        }
      ]
    : [
        {
          icon: icons.plan,
          label: "Plan de trabajo",
          description: "Objetivos generales y específicos",
          ruta: `/${rol}/${paciente}/plan`,
        },
        {
          icon: <Ionicons name={"list-outline"} size={50} color={colors.black}/>,
          label: "Recomendaciones",
          description: "Recomendaciones entregadas por profesionales",
          ruta: `/${rol}/${paciente}/recomendaciones`,
        },
        {
          icon: <Ionicons name={"people-outline"} size={50} color={colors.black}/>,
          label: "Equipo",
          description: "Gestión del equipo de trabajo",
          ruta: `/${rol}/${paciente}/equipo`,
        }
      ];
    
    //FILTRO
    const itemsFiltrados = items.filter((item) => {
      const textoBusqueda = busqueda.toLowerCase();
      const label = item.label.toLowerCase() ?? "";
      const description = item.description.toLowerCase() ?? "";
      return (
        label.includes(textoBusqueda) ||
        description.includes(textoBusqueda)
      )
  });

  //VISTA
  return (
    <View className="flex-1">
      <Titulo>
        {`¡Bienvenid@, ${primer_nombre}!`}
      </Titulo>
      <View className="flex-1">
        <Buscador
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          placeholder={"¿En qué te puedo ayudar hoy?"}
          icono={true}
        />
        <FlatList
          data={itemsFiltrados}
          keyExtractor={(item, index) => `${item.label}-${index}`}
          renderItem={({ item }) => (
            <TarjetaSelector
              titulo={item.label}
              onPress={() => router.replace(item.ruta)}
              subtitulo={[item.description]}
              icono={
                React.isValidElement(item.icon) ? (
                  item.icon
                ) : (
                  <Image
                    source={item.icon as any}
                    style={{ width: 40, height: 40, marginRight: 12 }}
                  />
                )
              }
            />
          )}
        />
      </View>
    </View>
  );

}
