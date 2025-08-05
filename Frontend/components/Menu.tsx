import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { Alert, Animated, Dimensions, Modal, Pressable, Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { colores } from "@/constants/colores";
import { TarjetaMenu } from "@/components/Tarjeta";
import { BotonEsquinaSuperiorIzquierda } from "@/components/Boton";

const ANIMATION_DURATION = 300;
const screenWidth = Dimensions.get("window").width;

function primeraLetraMayuscula(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function Menu({ visible, onClose }) {

  const router = useRouter();

  const { paciente } = useLocalSearchParams();
  
  const pathname = usePathname();
  const isProfesional = pathname.includes("/profesional");
  const ruta = decodeURIComponent(pathname || "");
  const ruta_partes = ruta.split("/").filter(Boolean);
  const rol = ruta_partes[0];

  const { user } = useAuth();
  if (!user) return null;

  //ESTADOS
  const [showMenu, setShowMenu] = useState(visible);
  const [rutaPendiente, setRutaPendiente] = useState<string | null>(null);

  const posicionMenu = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    if (visible) {
      setShowMenu(true);
      //ANIMACIÓN DE ENTRADA
      Animated.timing(posicionMenu, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      //ANIMACIÓN DE SALIDA
      Animated.timing(posicionMenu, {
        toValue: -screenWidth,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(async () => {
        setShowMenu(false);
        if (rutaPendiente) {
          //Navegar después de que el modal se cierre completamente
          router.replace(rutaPendiente);
          setRutaPendiente(null);
        }
      });
    }
  }, [visible, posicionMenu]);

  if (!showMenu) return null;

  return (
    <Modal visible={showMenu} transparent animationType="none">
      
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}
        onPress={onClose}
      />

      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "80%",
          backgroundColor: colores.light,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          paddingVertical: 8,
          shadowColor: colores.black,
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
          transform: [{ translateX: posicionMenu }],
        }}
      >
        
        <BotonEsquinaSuperiorIzquierda
          onPress={onClose}
          iconName="close"
          color={colores.black}
          accessibilityLabel="Cerrar menú"
        />

        <View className="mt-12">
          
          {/* USUARIO */}
          <View className="px-4 py-2 items-center">
            <Ionicons
              name="person-circle-outline"
              size={50}
              color={colores.black}
              style={{ marginBottom: 4 }}
            />
            <Text className="text-black text-2xl font-bold">{user.nombre}</Text>
            <Text className="text-mediumgrey text-base">{primeraLetraMayuscula(user.role)}</Text>
          </View>

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
                      console.log("[menú] Cerrando sesión...")
                      setRutaPendiente(`/login`);
                      onClose();
                    }
                  },
                ]
              );
            }}
          />

        </View>

      </Animated.View>
    </Modal>
  );
}