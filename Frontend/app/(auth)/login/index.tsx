import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "../../context/auth"; // ajusta la ruta si es necesario

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); // 👈 usar login del contexto

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleLogin = () => {
    const result = login(correo, contrasena);
    if (result.success) {
      Alert.alert("¡Éxito!", `Bienvenido, ${correo}`);
      router.replace("/"); // 👈 esto hará que index.tsx redirija según el rol
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <Text className="text-2xl font-bold mb-8">Iniciar sesión</Text>

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
