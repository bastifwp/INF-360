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
  const { login } = useAuth(); // 👈 importar login del contexto

  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargo, setCargo] = useState("");
  const [institucion, setInstitucion] = useState("");

  const handleRegistro = async () => {
    if (!rol || !nombre || !correo || !contrasena) {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }

    /* ------------- Si tienen corriendo la bd - -------------- */

    //Intentamos hacer fetch a la base de datos
    try {
      console.log("About to send");

      //Para acceder desde el pc la ruta es es: http://localhost:8000/registro (endpoint de la api de bakcend)
      //Para acceder desde el celular la ruta es: http://<ipv4 del pc>/registro 
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
      });

      console.log("Already sent")
      console.log(response.data);

      Alert.alert('Success', 'You have registered successfully!');
      setRol('');
      setNombre('');
      setContrasena('');
      setCargo('');
      setInstitucion('');
    }
    //Vemos si es que el try tira error
    catch(error){

      //Si la consulta tuvo error desde la base de datos (bad request)
      if(error.response){
        console.log(error.response.data);
        Alert.alert(error.response.data);
        Alert.alert('Error', error.response.data.message || 'Registration failed.'); //Esto no siempre funciona
      }  

      //Si la consulta fue rechazada o no llegó a la base de datos
      else {
        console.log(error);
        Alert.alert('Error', 'Network error. Please try again.');
      }
    };
    


    /*  Si no tienen corriendo la bd comentar lo de arriba y dejar lo q estaba: 

    const result = login(correo, contrasena); // 👈 login automático tras registro
    if (result.success) {
      Alert.alert("Registro exitoso", `Bienvenido, ${nombre}`);
      router.replace("/"); // 👈 redirige al index, que enviará según el rol
    } else {
      Alert.alert("Error", result.message);
    }*/
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
          />
          <TextInput
            className="w-full bg-white p-4 rounded-md mb-4 border border-gray-300"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />
          <TextInput
            className="w-full bg-white p-4 rounded-md mb-6 border border-gray-300"
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
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
              />
              <TextInput
                className="w-full bg-white p-4 rounded-md mb-6 border border-gray-300"
                placeholder="Institución"
                keyboardType="default"
                autoCapitalize="words"
                value={institucion}
                onChangeText={setInstitucion}
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
