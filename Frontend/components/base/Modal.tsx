import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, View } from "react-native";
import { colors } from "@/constants/colors";
import { BotonEsquinaSuperior } from "@/components/base/Boton";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const modalHeight = screenHeight * 0.9;

interface CustomModalProps {
  tipo: "x" | "-x" | "y" | "-y" | "0" | "1";
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fondoColor?: string;
  iconoColor?: string;
}
export function CustomModal({
  tipo,
  visible,
  onClose,
  children,
  fondoColor=colors.light,
  iconoColor=colors.black,
}: CustomModalProps) {

  const ANIMATION_DURATION = tipo === "0" || tipo === "1" ? 0 : 500;

  //ESTADOS
  const [showModal, setShowModal] = useState(visible);
  const modalPosition = useRef(new Animated.Value(
    tipo === "-x" ? -screenWidth :
    tipo === "-y" ? screenHeight :
    -screenWidth
  )).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      //ANIMACIÓN DE ENTRADA
      Animated.timing(modalPosition, {
        toValue:
          tipo === "-x" ? 0 :
          tipo === "-y" ? screenHeight - modalHeight :
          0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      //ANIMACIÓN DE SALIDA
      Animated.timing(modalPosition, {
        toValue:
          tipo === "-x" ? -screenWidth :
          tipo === "-y" ? screenHeight :
          -screenWidth,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setShowModal(false), 0); // 👈 se ejecuta en el siguiente tick
      });
    }
  }, [visible, modalPosition]);

  if (!showModal) return null;

  return (
    
    <Modal visible={showModal} transparent animationType="none">
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        onPress={onClose}
      />
      <Animated.View
        style={{
          position: "absolute",
          left: tipo === "0" || tipo === "1" ? screenWidth * 0.1 : 0,
          top: 
            tipo === "1" ? (screenHeight - screenHeight * 0.3) / 2 :
            tipo === "0" ? screenHeight * 0.2 : 
            0,
          bottom: 0,
          width:
            tipo === "-x" ? "80%" :
            tipo === "-y" ? "100%":
            tipo === "0" ? screenWidth * 0.8 :
            tipo === "1" ? screenWidth * 0.8 :
            "100%",
          height:
            tipo === "-x" ? "100%" :
            tipo === "-y" ? modalHeight:
            tipo === "0" ? screenHeight * 0.6 :
            tipo === "1" ? screenHeight * 0.3 :
            "100%",
          backgroundColor: fondoColor,
          borderTopRightRadius: 
            tipo === "-x" ? 20 :
            tipo === "-y" ? 20 :
            tipo === "0" ? 20 :
            tipo === "1" ? 20 :
            0,
          borderBottomRightRadius:
            tipo === "-x" ? 20 :
            tipo === "-y" ? 0 :
            tipo === "0" ? 20 :
            tipo === "1" ? 20 :
            0,
          borderTopLeftRadius:
            tipo === "-x" ? 0 :
            tipo === "-y" ? 20 :
            tipo === "0" ? 20 :
            tipo === "1" ? 20 :
            0,
          borderBottomLeftRadius:
            tipo === "-x" ? 0 :
            tipo === "-y" ? 0 :
            tipo === "0" ? 20 :
            tipo === "1" ? 20 :
            0,
          paddingVertical: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
          transform: 
            tipo === "-x" ? [{ translateX: modalPosition }] :
            tipo === "-y" ? [{ translateY: modalPosition }] :
            tipo === "0" || tipo === "1" ? [] :
            [{ translateX: modalPosition }],
        }}
      >
        <BotonEsquinaSuperior
          tipo={
            tipo === "-x" ? "izquierda" :
            tipo === "-y" ? "derecha" :
            tipo === "0" ? "derecha" :
            tipo === "1" ? "derecha" :
            "izquierda"
          }
          onPress={onClose}
          iconName={"close"}
          color={iconoColor}
          accessibilityLabel={"Cerrar modal"}
        />
        <View className="flex-1 p-4 mt-8">
          {children}
        </View>
      </Animated.View>
    </Modal>
  );

}