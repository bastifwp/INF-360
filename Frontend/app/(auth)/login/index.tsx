import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useAuth } from "../../context/auth"; // ajusta la ruta si es necesario

import { Platform } from 'react-native';

import { images } from "@/constants/images";

//Para hacer consultas a apis
import axios from 'axios';

export default function asyLoginScreen() {
  
  const router = useRouter();
  const { login } = useAuth(); // 👈 usar login del contexto

  //Estados para almacenar la info 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {


    try {
      console.log("About to send");

      //Para acceder desde el pc la ruta es es: http://localhost:8000/registro (endpoint de la api de bakcend)
      //Para acceder desde el celular la ruta es: http://<ipv4 del pc>:8000/registro 
      //Eso pasa porque el celular no hace la conuslta al localhost (a el mismo) sino que lo hace al pc
      const response = await login(email, password);
      

      console.log('Éxito', '¡Has iniciado sesión exitosamente!');
      Alert.alert('Éxito', '¡Has iniciado sesión exitosamente!');
      router.replace("/"); // 👈 esto hará que index.tsx redirija según el rol

      setEmail('');
      setPassword('');

    }
    //Vemos si es que el try tira error
    catch(error: unknown){
      
      if(axios.isAxiosError(error) && error.response?.status === 400){
        const errores = error.response.data;
        console.log(errores);

        //Verificamos errores en cada campo
        if(errores.email){
          Alert.alert('Error en email: ' + errores.email[0]);
        }

        //Aqui en vez del else agregar otros errores
        else{
          Alert.alert("Error al iniciar sesión. Intenta nuevamente.");
          console.log("Error al iniciar sesión. Intenta nuevamente.");
        }
      }

      //EL error no es de axios
      else{
        Alert.alert("Error desconocido al intentar iniciar sesión. Intenta nuevamente.");
        console.log("Error desconocido al intentar iniciar sesión. Intenta nuevamente.");
      }
    };
  }
    
    


  


  /*
  const handleLogin = () => {
    const result = login(correo, contrasena);
    if (result.success) {
      Alert.alert("¡Éxito!", `Bienvenido, ${correo}`);
      router.replace("/"); // 👈 esto hará que index.tsx redirija según el rol
    } else {
      Alert.alert("Error", result.message);
    }
  };
  */

return (

<View className="bg-primary px-6 pt-10 pb-10 flex-grow">

  {/* 👉 Marca: Logo + Nombre */}
  <View className="flex-row items-center justify-center mb-10">
    <Image
      source={images.logo}
      style={{
        width: Platform.OS === 'web' ? 48 : 80,  // 48px para web, 80px para móvil
        height: Platform.OS === 'web' ? 48 : 80,
        marginRight: 16,
      }}
      resizeMode="contain"
    />
    <Text className="text-3xl font-bold text-white">CEAPP</Text>
  </View>

  {/* 👉 Contenedor del formulario */}
  <View className="bg-white p-6 py-10 rounded-2xl shadow-lg">

    {/* 👉 Título principal */}
    <Text className="text-3xl font-bold text-primary mb-6 text-center">
      Iniciar sesión
    </Text>

    {/* 👉 Campo Email */}
    <View className="w-full mb-4">
      <Text className="text-primary mb-2 font-semibold">Email</Text>
      <TextInput
        className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
        placeholder="Ingresa tu email"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
    </View>

    {/* 👉 Campo Contraseña */}
    <View className="w-full mb-6">
      <Text className="text-primary mb-2 font-semibold">Contraseña</Text>
      <TextInput
        className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
        placeholder="Ingresa tu contraseña"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
    </View>

    {/* 👉 Botón Login */}
    <TouchableOpacity
      className="w-full bg-primary py-4 rounded-lg mb-4"
      onPress={handleLogin}
    >
      <Text className="text-white text-center font-semibold text-base">
        Entrar
      </Text>
    </TouchableOpacity>

    {/* 👉 Texto intermedio */}
    <Text className="text-gray-600 text-center mb-4">
      ¿No tienes una cuenta?
    </Text>

    {/* 👉 Botón Registro */}
    <TouchableOpacity
      className="w-full bg-white border border-secondary py-4 rounded-lg"
      onPress={() => router.push("/registro")}
    >
      <Text className="text-secondary text-center font-semibold text-base">
        Registrarme
      </Text>
    </TouchableOpacity>

  </View>
</View>

);


}
