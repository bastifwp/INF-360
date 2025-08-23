import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { CodigoCard } from "@/components/base/CodigoCard";
import { MensajeCard } from "@/components/base/MensajeCard";

//BÁSICAMENTE COPIAR CÓDIGO DE ENTRADA-AGREGAR U OBJETIVO-AGREGAR Y ADAPTARLO :)
  
export default function EquipoAgregar() {
  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();
  
    const router = useRouter();
  
    // ESTADOS
    const [codigo, setCodigo] = useState('');
    const [isLoadingBoton, setIsLoadingBoton] = useState(false);
  
    // HANDLE: GENERAR
    const handleGenerar = async () => {
      console.log("[equipo-agregar] Solicitando generación de código...");
    };
  
    return (
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <Titulo>Agregar profesional</Titulo>
        <View className="gap-2">
          <MensajeCard 
            titulo="Instrucciones"
            mensajes={[
              "Presiona el botón para generar un código",
              "Envía el código al profesional que deseas agregar",
              "Pide al profesional que ingrese el código en el apartado de Agregar Paciente",
              "¡Listo! El profesional ya tendrá acceso al plan de trabajo del paciente"
            ]}
          />
          <Boton
            texto={"Generar código"}
            onPress={handleGenerar}
            isLoading={isLoadingBoton}
            tipo={3}
          />
          <CodigoCard codigo={codigo} />
        </View>
      </KeyboardAwareScrollView>
    );
}