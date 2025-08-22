import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { FormularioCampo } from "@/components/base/Entrada";
import { MensajeCard } from "@/components/base/MensajeCard";

export default function PacienteAgregarProfesional() {
  
  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();

  const router = useRouter();

  // ESTADOS
  const [codigo, setCodigo] = useState('');
  const [isLoadingBoton, setIsLoadingBoton] = useState(false);

  // HANDLE: GUARDAR
  const handleGuardar = async () => {
    if (!codigo) {
      Alert.alert("Error", "Por favor, ingresa un código");
      return;
    }
    console.log("Código ingresado:", { codigo });
    //Aqui podriamos mandarlos directamente al plan de trabajo del paciente agregado
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={24}
    >
      <Titulo>Agregar paciente</Titulo>
      <View className="gap-2">
        <MensajeCard 
          titulo="Instrucciones"
          mensajes={[
            "Solicita el código del paciente a su cuidador",
            "Ingresa el código en el campo provisto abajo",
            "¡Listo! Ya tendrás acceso al plan de trabajo del paciente"
          ]}
        />

        <FormularioCampo
          label={""}
          value={codigo}
          onChangeText={setCodigo}
          placeholder={"Código"}
          maxLength={255}
          asterisco={true}
          tipo={2}
        />
        <Boton
          texto={"Ingresar código"}
          onPress={handleGuardar}
          isLoading={isLoadingBoton}
          tipo={3}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
