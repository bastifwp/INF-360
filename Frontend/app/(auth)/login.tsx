import axios from "axios";
import { useRouter } from "expo-router";
import { Alert, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/Boton";
import { Titulo } from "@/components/Titulo";
import { FormularioCampo } from "@/components/FormularioCampo";

export default function Login() {
  
  const router = useRouter();

  const { login } = useAuth();

  //ESTADOS
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [limpiarCache, setLimpiarCache] = useState(true);

  useEffect(() => {
    if (limpiarCache) {
      console.log("[login] Borrando almacenamiento local...");
      AsyncStorage.clear();
      setLimpiarCache(false);
    }
  })

  const handleLogin = async () => {

    if (!correo || !contrasena) {
      console.log("[login] Error. Por favor, completa todos los campos requeridos...");
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }

    //INICIO DE SESIÓN EXITOSO
    try {
      console.log("[login] Comunicándose con la base de datos...");
      const respuesta = await login(correo, contrasena);
      console.log("[login] Inicio de sesión exitoso...");
      Alert.alert("Éxito", "¡Has iniciado sesión exitosamente!");
      router.replace("/"); //Redireccionar a index
      setCorreo('');
      setContrasena('');
    }
    //INICIO DE SESIÓN CON ERRORES
    catch (error: unknown) { 
      //ERROR DE AXIOS
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errores = error.response.data;
        console.log("[login]", errores);
        if (errores.correo) {
          console.log("[login] Error en correo: " + errores.correo[0]);
          Alert.alert("Error en correo: " + errores.correo[0]);
        } else {
          console.log("[login] Error al iniciar sesión...");
          Alert.alert("Error al iniciar sesión. Intenta nuevamente.")
        }
      } else {
        console.log("[login] Error desconocido al iniciar sesión...");
        Alert.alert("Error desconocido al iniciar sesión. Intenta nuevamente.");
      }
    };
  }
  
  //VISTA
  return (
    <>

      <Titulo> Iniciar sesión </Titulo>

      <FormularioCampo
        label="Correo electrónico"
        placeholder="Ingresa tu correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <FormularioCampo
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <Boton
        texto="Iniciar sesión"
        onPress={handleLogin}
        tipo={1}
      />

      <Text className="text-mediumdarkgrey text-center mb-4">
        ¿No tienes una cuenta?
      </Text>

      <Boton
        texto="Registrarme"
        onPress={() => router.push("/registro")}
        tipo={2}
      />

    </>
  );

}