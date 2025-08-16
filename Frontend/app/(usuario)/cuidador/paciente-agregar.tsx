import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { FormularioCampo, FormularioCampoFechaNacimiento } from "@/components/base/Entrada";

export default function PacienteAgregar() {
  
  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();

  const router = useRouter();

  // ESTADOS
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(null);
  const [sexo, setSexo] = useState('');
  const [isLoadingBoton, setIsLoadingBoton] = useState(false);

  // HANDLE: GUARDAR
  const handleGuardar = async () => {
    if (!nombre || !fechaNacimiento || !sexo) {
      Alert.alert("Error", "Por favor, completa todos los campos marcados con *.");
      return;
    }
    console.log("Guardando paciente:", { nombre, fechaNacimiento, sexo });
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
        <FormularioCampo
          label={"Nombre"}
          value={nombre}
          onChangeText={setNombre}
          placeholder={"Ingresa un nombre"}
          maxLength={255}
          asterisco={true}
          tipo={2}
        />
        <FormularioCampoFechaNacimiento
          fecha={fechaNacimiento}
          setFecha={setFechaNacimiento}
          label={"Fecha de nacimiento"}
          placeholder={"Selecciona una fecha de nacimiento..."}
          asterisco={true}
          tipo={2}
        />
        <FormularioCampo
          label={"Sexo"}
          value={sexo}
          onChangeText={setSexo}
          radioButton
          options={["Masculino", "Femenino", "Otro"]}
          asterisco={true}
          tipo={2}
        />
        <Boton
          texto={"Guardar"}
          onPress={handleGuardar}
          isLoading={isLoadingBoton}
          tipo={3}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
