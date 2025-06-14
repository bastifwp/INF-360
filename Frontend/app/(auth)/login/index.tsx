import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/auth"; // ajusta la ruta si es necesario

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
      

      console.log('Success', 'You have loged successfully!');
      Alert.alert('Success', 'You have loged successfully!');
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
          Alert.alert("Error al iniciar sesión");
          console.log("Error al iniciar sesión");
        }
      }

      //EL error no es de axios
      else{
        Alert.alert("Error desconocido al intentar iniciar sesión");
        console.log("Error desconocido al intentar iniciar sesión");
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
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <Text className="text-2xl font-bold mb-8">Iniciar sesión</Text>

      <TextInput
        className="w-full bg-white p-4 rounded-md mb-4 border border-gray-300"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full bg-white p-4 rounded-md mb-6 border border-gray-300"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="w-full bg-blue-600 py-4 rounded-md"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold">Entrar</Text>
      </TouchableOpacity>

      <Text>¿No tienes una cuenta?</Text>

      <TouchableOpacity
        className="w-full bg-blue-600 py-4 rounded-md"
        onPress={() => router.push("/registro")}
      >
        <Text className="text-white text-center font-semibold">Registrarme</Text>
      </TouchableOpacity>
    </View>
  );
}
