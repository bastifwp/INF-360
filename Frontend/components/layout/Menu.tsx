import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { Alert, Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { TarjetaMenu } from "@/components/base/Tarjeta";
import { CustomModal } from "@/components/base/Modal";

function primeraLetraMayuscula(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function Menu({ visible, onClose, paciente }) {
  const router = useRouter();
  const { user } = useAuth();
  if (!user) return null;
  const isProfesional = user?.role === "profesional";

  const pathname = usePathname();
  const ruta = decodeURIComponent(pathname || "");
  const ruta_partes = ruta.split("/").filter(Boolean);
  const rol = ruta_partes[0];

  //ESTADOS
  const [rutaPendiente, setRutaPendiente] = useState<string | null>(null);

  //RUTA PENDIENTE: REVISAR!
  useEffect(() => {
    if (!visible && rutaPendiente) {
      // Postergar la navegación para evitar conflictos de render
      setTimeout(() => {
        router.replace(rutaPendiente);
        setRutaPendiente(null);
      }, 0);
    }
  }, [visible, rutaPendiente, router]);

  //VISTA
  return (
    <CustomModal
      tipo={"-x"}
      visible={visible}
      onClose={onClose}
      fondoColor={colors.primary}
      iconoColor={colors.white}
    >
      <View>

        {/* USUARIO */}
        <View className="px-4 py-4 items-center">
          <Ionicons
            name="person-circle-outline"
            size={50}
            color={colors.white}
          />
          <Text className="text-white text-2xl font-bold">{user.nombre}</Text>
          <Text className="text-lightgrey text-base">{primeraLetraMayuscula(user.role)}</Text>
        </View>

        <View className="gap-4">

          {isProfesional ? <TarjetaMenu
            titulo={"Actividades"}
            iconoNombre={"play-circle"}
            onPress={() => {
              setRutaPendiente(`/${rol}/${paciente}/actividades`);
              onClose();
            }}
          /> : null}

          <TarjetaMenu
            titulo={"Equipo"}
            iconoNombre={"people-outline"}
            onPress={() => {
              setRutaPendiente(`/${rol}/${paciente}/equipo`);
              onClose();
            }}
          />

          <TarjetaMenu
            titulo={"Cambiar paciente"}
            iconoNombre={"heart-circle-outline"}
            onPress={() => {
              setRutaPendiente(`/${rol}`);
              onClose();
            }}
          />

          <TarjetaMenu
            titulo={"Cerrar sesión"}
            fondoColor={colors.lightred}
            textoColor={colors.black}
            iconoColor={colors.mediumred}
            iconoNombre={"log-out-outline"}
            onPress={() => {
              Alert.alert(
                "¿Cerrar sesión?",
                "¿Estás segur@ de que deseas cerrar sesión?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: () => {
                      console.log("[menú] Cerrando sesión...");
                      setRutaPendiente(`/login`);
                      onClose();
                    },
                  },
                ]
              );
            }}
          />
          
        </View>

      </View>
    </CustomModal>
  );
}