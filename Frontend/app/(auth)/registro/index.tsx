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
} from "react-native";
import RadioButton from "../../components/RadioButton";
import { useAuth } from "../../context/auth"; // Ajusta la ruta según tu estructura


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
      const response = await axios.post('http://192.168.1.164:8000/registro/', {
        
        //En el backend hay un "serializer" por cada consulta
        //El serializer del backend te dice la estructura del json a mandar
        nombre: nombre, 
        password: contrasena,
        email: correo,
        role: rol,
        cargo: cargo,
        institucion: institucion,
      });

      console.log("Successfull register");
      console.log(response.data);
      
      Alert.alert('Success', 'You have registered successfully!');

      //Como el registro fue un éxito entonces ahora intentamos logearnos
      try{
        const result = login(correo, contrasena);
        console.log("Succesfull login");
        Alert.alert("Succesfull login");

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

        Alert.alert("Error al registrarse");
        console.log("Error al registrarse");
      }

      //EL error no es de axios
      else{
        Alert.alert("Error desconocido al intentar registrarse");
        console.log("Error desconocido al intentar registrarse");
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
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="justify-center items-center bg-gray-100 px-6">
          <Text className="text-2xl font-bold mb-8">Registro</Text>

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

          <TextInput
            className="w-full bg-white p-4 rounded-md mb-4 border border-gray-300"
            placeholder="Nombre"
            keyboardType="default"
            autoCapitalize="words"
            value={nombre}
            onChangeText={setNombre}
            maxLength={100}
          />
          <TextInput
            className="w-full bg-white p-4 rounded-md mb-4 border border-gray-300"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
            maxLength={100}
          />
          <TextInput
            className="w-full bg-white p-4 rounded-md mb-6 border border-gray-300"
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
            maxLength={100}
          />

          {rol === "profesional" && (
            <>
              <TextInput
                className="w-full bg-white p-4 rounded-md mb-6 border border-gray-300"
                placeholder="Cargo"
                keyboardType="default"
                autoCapitalize="words"
                value={cargo}
                onChangeText={setCargo}
                maxLength={100}
              />
              <TextInput
                className="w-full bg-white p-4 rounded-md mb-6 border border-gray-300"
                placeholder="Institución"
                keyboardType="default"
                autoCapitalize="words"
                value={institucion}
                onChangeText={setInstitucion}
                maxLength={100}
              />
            </>
          )}

          <TouchableOpacity
            className="w-full bg-blue-600 py-4 rounded-md"
            onPress={handleRegistro}
          >
            <Text className="text-white text-center font-semibold">Registrarme</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
