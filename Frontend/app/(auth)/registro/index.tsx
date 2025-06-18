import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import RadioButton from "../../components/RadioButton";
import { useAuth } from "../../context/auth"; // Ajusta la ruta según tu estructura
import { Ionicons } from '@expo/vector-icons'; 
import { images } from "@/constants/images";

//Para hacer consultas a apis
import axios from 'axios';

export default function Registro() {
  const router = useRouter();
  const { login } = useAuth(); // 👈 ocupamos la función login del contexto

  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargo, setCargo] = useState("");
  const [institucion, setInstitucion] = useState("");

  const handleRegistro = async () => {
    if (!rol || !nombre || !correo || !contrasena) {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      console.log("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }

    /* ------------- Si tienen corriendo la bd - -------------- */

    
    //Intentamos hacer fetch a la base de datos
    try {
      console.log("About to send");

      //Para acceder desde el pc la ruta es es: http://localhost:8000/registro (endpoint de la api de bakcend)
      //Para acceder desde el celular la ruta es: http://<ipv4 del pc>:8000/registro 
      //Eso pasa porque el celular no hace la conuslta al localhost (a el mismo) sino que lo hace al pc
      const response = await axios.post('http://localhost:8000/registro/', {
        
        //En el backend hay un "serializer" por cada consulta
        //El serializer del backend te dice la estructura del json a mandar
        nombre: nombre, 
        password: contrasena,
        email: correo,
        role: rol,
        cargo: cargo,
        institucion: institucion,
      }, {timeout: 5000});

      console.log("Successfull register");
      console.log(response.data);
      
      Alert.alert('Éxito', '¡Te has registrado exitosamente!');

      //Como el registro fue un éxito entonces ahora intentamos logearnos
      try{
        const result = login(correo, contrasena);
        console.log("Inicio de sesión exitoso");
        Alert.alert("Inicio de sesión exitoso");

        //Redireccionamos al index
        router.replace("/");
      }
      catch(error: unknown){

        if(axios.isAxiosError(error) && error.response?.status === 400){
          const errores = error.response.data;

          Alert.alert("Error al iniciar sesión");
          console.log("Error al iniciar sesión");
        }else{
            
          Alert.alert("Error desconocido al iniciar sesión");
          console.log("Error desconocido al iniciar sesión");

        }
      }
      
    

      setRol('');
      setNombre('');
      setContrasena('');
      setCargo('');
      setInstitucion('');
    }
    //Vemos si es que el try tira error
    catch(error: unknown){

      if(axios.isAxiosError(error) && error.response?.status === 400){
        const errores = error.response.data;

        Alert.alert("Error al registrarse. Intenta nuevamente.");
        console.log("Error al registrarse. Intenta nuevamente.");
      }

      //EL error no es de axios
      else{
        Alert.alert("Error desconocido al intentar registrarse. Intenta nuevamente.");
        console.log("Error desconocido al intentar registrarse. Intenta nuevamente.");
      }
    };
    
    
    /*
    const result = login(correo, contrasena); // 👈 login automático tras registro
    if (result.success) {
      Alert.alert("Registro exitoso", `Bienvenido, ${nombre}`);
      router.replace("/"); // 👈 redirige al index, que enviará según el rol
    } else {
      Alert.alert("Error", result.message);
    }
    */
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botón flecha atrás usando Ionicons */}
        <TouchableOpacity
          onPress={() => router.push("/login")} // o router.back()
          style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
          accessible={true}
          accessibilityLabel="Volver al inicio de sesión"
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        {/* Logo + Nombre */}
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

        {/* Contenedor formulario */}
        <View className="bg-white p-6 py-10 rounded-2xl shadow-lg">
          {/* Título */}
          <Text className="text-3xl font-bold text-primary mb-6 text-center">
            Registro
          </Text>

          {/* Selector Rol */}
          <View className="flex-row justify-around mb-2">
            <RadioButton
              label="Soy cuidador"
              value="cuidador"
              selected={rol === "cuidador"}
              onSelect={setRol}
            />
            <RadioButton
              label="Soy profesional"
              value="profesional"
              selected={rol === "profesional"}
              onSelect={setRol}
            />
          </View>

          {/* Campos formulario */}

          <View className="w-full mb-4">
            <Text className="text-primary mb-2 font-semibold">Nombre</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
              placeholder="Nombre"
              autoCapitalize="words"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View className="w-full mb-4">
            <Text className="text-primary mb-2 font-semibold">Email</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
            />
          </View>

          <View className="w-full mb-4">
            <Text className="text-primary mb-2 font-semibold">Contraseña</Text>
            <TextInput
              className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
              placeholder="Contraseña"
              secureTextEntry
              value={contrasena}
              onChangeText={setContrasena}
            />
          </View>

          {rol === "profesional" && (
            <>
              <View className="w-full mb-4">
                <Text className="text-primary mb-2 font-semibold">Cargo</Text>
                <TextInput
                  className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
                  placeholder="Cargo"
                  autoCapitalize="words"
                  value={cargo}
                  onChangeText={setCargo}
                />
              </View>

              <View className="w-full mb-4">
                <Text className="text-primary mb-2 font-semibold">Institución</Text>
                <TextInput
                  className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-primary"
                  placeholder="Institución"
                  autoCapitalize="words"
                  value={institucion}
                  onChangeText={setInstitucion}
                />
              </View>
            </>
          )}

          {/* Botón Registrar */}
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-lg"
            onPress={handleRegistro}
          >
            <Text className="text-white text-center font-semibold text-base">
              Registrarme
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
