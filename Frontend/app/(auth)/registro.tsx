import axios from 'axios';
import Constants from 'expo-constants';
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { useAuth } from "@/context/auth";
import { Titulo } from "@/components/Titulo";
import { Boton, BotonRadio } from "@/components/Boton";
import { FormularioCampo } from "@/components/FormularioCampo";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function Registro() {

  const router = useRouter();

  const { login } = useAuth();

  //ESTADOS
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargo, setCargo] = useState("");
  const [institucion, setInstitucion] = useState("");

  const handleRegistro = async () => {

    if (!rol || !nombre || !correo || !contrasena) {
      console.log("[registro] Error. Por favor, completa todos los campos requeridos...");
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }
    
    //FETCH A LA BASE DE DATOS
    try {

      console.log("[registro] Comunicándose con la base de datos...");
      const respuesta_registro = await axios.post(`${API_BASE_URL}/registro/`, {
        //En el backend hay un "serializer" por cada consulta
        //El serializer del backend te dice la estructura del JSON a mandar
        nombre: nombre, 
        password: contrasena,
        email: correo,
        role: rol,
        cargo: cargo,
        institucion: institucion,
      }, {timeout: 5000});

      console.log("[registro] Registro exitoso...");
      console.log("[registro]", respuesta_registro.data);
      Alert.alert('Éxito', '¡Te has registrado exitosamente!');

      //INICIO DE SESIÓN
      try {
        const respuesta_login = await login(correo, contrasena);
        console.log("[registro] Inicio de sesión exitoso...");
        Alert.alert("Inicio de sesión exitoso.");
        router.replace("/"); //Redireccionar a index
      }
      //ERROR AL INICIAR SESIÓN
      catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const errores = error.response.data;
          console.log("[registro] Error al iniciar sesión...");
          console.log("[registro]", errores);
          Alert.alert("Error al iniciar sesión.");
        } else {
          console.log("[registro] Error desconocido al iniciar sesión...");
          Alert.alert("Error desconocido al iniciar sesión.");
        }
      }
      setRol('');
      setNombre('');
      setContrasena('');
      setCargo('');
      setInstitucion('');
    }

    //ERROR AL REGISTRARSE
    catch (error: unknown) {
      //ERROR DE AXIOS
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errores = error.response.data;
        console.log("[registro] Error al registrarse...");
        console.log("[registro]", errores);
        Alert.alert("Error al registrarse. Intenta nuevamente.");
      } else {
        console.log("[registro] Error desconocido al registrarse...");
        Alert.alert("Error desconocido al registrarse. Intenta nuevamente.");
      }
    };
    
  };

  //VISTA
  return (
    <>
    
      <Titulo> Registro </Titulo>
      
      <View className="flex-row justify-around mb-2">
        <BotonRadio
          label="Soy cuidador"
          value="cuidador"
          selected={rol === "cuidador"}
          onSelect={setRol}
        />
        <BotonRadio
          label="Soy profesional"
          value="profesional"
          selected={rol === "profesional"}
          onSelect={setRol}
        />
      </View>

      <FormularioCampo
        label="Nombre"
        placeholder="Ingresa tu nombre"
        autoCapitalize="words"
        value={nombre}
        onChangeText={setNombre}
      />
      
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

      {rol == "profesional" && (
        <>

        <FormularioCampo
          label="Institución"
          placeholder="Ingresa tu institución"
          autoCapitalize="words"
          value={institucion}
          onChangeText={setInstitucion}
        />

        <FormularioCampo
          label="Cargo"
          placeholder="Ingresa tu cargo"
          autoCapitalize="words"
          value={cargo}
          onChangeText={setCargo}
        />

        </>
      )}

      <Boton
        texto="Registrarme"
        onPress={handleRegistro}
        tipo={1}
      />
    
    </>
  );

}
