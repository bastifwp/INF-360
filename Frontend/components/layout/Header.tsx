import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { View, Image, Platform, Text, Alert } from "react-native";
import { images } from "@/constants/images";
import { Menu } from "@/components/layout/Menu";
import { BotonEsquinaSuperior } from "@/components/base/Boton";
import { useDescartarCambios } from "@/context/DescartarCambios";

//HEADER
export function Header() {

  const router = useRouter();
  
  const ruta = decodeURIComponent(usePathname());
  if (!ruta) return null;
  const ruta_partes = ruta.split("/").filter(Boolean);
  const rol = ruta_partes[0];
  const paciente = ruta_partes[1];
  let ruta_atras: string | null = null;

  const { handleDescartarCambios } = useDescartarCambios();
  let usarDescartarCambios = false;

  //ESTADOS
  const [menu, setMenu] = useState(false);

  //0: cerrar sesión
  //1: menú
  //2: volver atrás
  let icono: 0 | 1 | 2;

  if (ruta_partes.length === 1) {
    icono = 0;
    ruta_atras = "/login";
  } else if (ruta.includes("/paciente-agregar")) {
    icono = 2;
    ruta_atras = `/${rol}`;
    usarDescartarCambios = true;
  } else if (ruta.includes("/equipo/equipo-agregar")) {
    icono = 2;
    ruta_atras = `/${rol}/${paciente}/equipo`;
    usarDescartarCambios = true;
  } else if (ruta_partes.length === 2) {
    icono = 1;
  } else if (ruta.includes("/objetivo-general-agregar") || ruta.includes("/objetivo-especifico-agregar")) {
    icono = 2;
    ruta_atras = `/${rol}/${paciente}/plan`;
    usarDescartarCambios = true;
  } else if (ruta.includes("/actividad-agregar")) {
    icono = 2;
    ruta_atras = `/${rol}/${paciente}/actividades`;
    usarDescartarCambios = true;
  } else if (ruta.includes("/entrada")) {
    icono = 2;
    ruta_atras = `/${rol}/${paciente}/bitacora`;
    usarDescartarCambios = true;
  } else {
    icono = 1;
  }

  const handlePress = () => {
    if (usarDescartarCambios && handleDescartarCambios) {
      handleDescartarCambios(ruta_atras!);
    } else if (icono === 0) {
      Alert.alert(
        "¿Cerrar sesión?",
        "¿Estás segur@ de que deseas cerrar sesión?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Cerrar sesión",
            style: "destructive",
            onPress: () => router.replace(ruta_atras!),
          },
        ]
      );
    } else {
      router.replace(ruta_atras!);
    }
  };

  return (

    <View className="flex-row bg-primary h-16 justify-center items-center relative">

      {icono === 0 && (
        <BotonEsquinaSuperior
          tipo={"izquierda"}
          onPress={handlePress}
          iconName="log-out-outline"
          accessibilityLabel="Cerrar sesión"
        />
      )}

      {icono === 1 && (
        <BotonEsquinaSuperior
          tipo={"izquierda"}
          onPress={() => setMenu(true)}
          iconName="menu"
          accessibilityLabel="Abrir menú"
        />
      )}

      {icono === 2 && (
        <BotonEsquinaSuperior
          tipo={"izquierda"}
          onPress={handlePress}
          iconName="arrow-back"
          accessibilityLabel="Volver atrás"
        />
      )}

      <View className="flex-row items-center">
        <Image
          source={images.logo}
          className="mr-2 align-middle"
          style={{
            width: Platform.OS === "web" ? 40 : 40,
            height: Platform.OS === "web" ? 40 : 40,
          }}
          resizeMode="contain"
        />
        <Text className="text-2xl text-light font-extrabold align-middle">CEApp</Text>
      </View>

      <Menu
        visible={menu}
        onClose={() => setMenu(false)}
        paciente={paciente}
      />

    </View>

  );

}

//HEADER PACIENTE
type HeaderPacienteProps = {
  nombre: string;
};
export function HeaderPaciente({ nombre }: HeaderPacienteProps) {
  return (
    <View className="bg-secondary px-4 py-2 flex-row items-center justify-center gap-1">
      <Ionicons name="heart-circle-outline" size={20} color="white" />
      <Text className="text-white text-base font-bold">
        Paciente: {nombre}
      </Text>
    </View>
  );
}