import axios from "axios";
import { useRouter } from "expo-router";
import { Alert, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/auth";
import { Boton } from "@/components/base/Boton";
import { Titulo } from "@/components/base/Titulo";
import { FormularioCampo } from "@/components/base/Entrada";

export default function Login() {
  
  const router = useRouter();

  const { login } = useAuth();

  //ESTADOS
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [limpiarCache, setLimpiarCache] = useState(true);
  const [isLoadingBoton, setIsLoadingBoton] = useState(false);

  useEffect(() => {
    if (limpiarCache) {
      console.log("[login] Borrando almacenamiento local...");
      AsyncStorage.clear();
      setLimpiarCache(false);
    }
  })

  //HANDLE: LOGIN
  const handleLogin = async () => {
    if (!correo || !contrasena) {
      console.log("[login] Error. Por favor, completa todos los campos...");
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    //INICIO DE SESIÓN EXITOSO
    try {
      setIsLoadingBoton(true);
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
          Alert.alert("Error", "Error en correo: " + errores.correo[0]);
        } else {
          console.log("[login] Error al iniciar sesión...");
          Alert.alert("Error", "Error al iniciar sesión. Por favor, intenta nuevamente.")
        }
      } else {
        console.log("[login] Error desconocido al iniciar sesión...");
        Alert.alert("Error", "Error desconocido al iniciar sesión. Por favor, intenta nuevamente.");
      }
    } finally {
      setIsLoadingBoton(false);
    }
  }
  
  //VISTA
  return (
    
    <View className="gap-2">

      <Titulo>Iniciar sesión</Titulo>

      <View className="gap-2">
        <FormularioCampo
          label={"Correo electrónico"}
          placeholder={"Ingresa tu correo electrónico"}
          keyboardType={"email-address"}
          autoCapitalize={"none"}
          value={correo}
          onChangeText={setCorreo}
          tipo={1}
        />
        <FormularioCampo
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
          tipo={1}
        />
        <Boton
          texto="Iniciar sesión"
          onPress={handleLogin}
          isLoading={isLoadingBoton}
          tipo={1}
        />
      </View>

      <View className="mt-2">
        <Text className="text-mediumdarkgrey text-center">
          ¿No tienes una cuenta?
        </Text>
        <Boton
          texto="Registrarme"
          onPress={() => router.push("/registro")}
          tipo={2}
        />
      </View>

    </View>

  );

}