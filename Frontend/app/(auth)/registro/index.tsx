import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/auth"; // Ajusta la ruta según tu estructura

import RadioButton from "../../components/RadioButton";

export default function Registro() {
  const router = useRouter();
  const { login } = useAuth(); // 👈 importar login del contexto

  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargo, setCargo] = useState("");
  const [institucion, setInstitucion] = useState("");

  const handleRegistro = () => {
    if (!rol || !nombre || !correo || !contrasena) {
      Alert.alert("Error", "Por favor, completa todos los campos requeridos.");
      return;
    }

    // Aquí podrías guardar datos en una base real si tuvieras backend

    const result = login(correo, contrasena); // 👈 login automático tras registro

    if (result.success) {
      Alert.alert("Registro exitoso", `Bienvenido, ${nombre}`);
      router.replace("/"); // 👈 redirige al index, que enviará según el rol
    } else {
      Alert.alert("Error", result.message);
    }
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
