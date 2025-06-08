import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "./context/auth"; 
import { View, Text } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
  if (!isReady) return;
  if (user === undefined) return;

  console.log("Usuario autenticado:", user);

  if (user) {
    if (user.rol === "profesional") {
      console.log("Redirigiendo a profesional");
      router.replace("/profesional");
    } else if (user.rol === "cuidador") {
      console.log("Redirigiendo a cuidador");
      router.replace("/cuidador");
    } else {
      console.log("Rol no reconocido:", user.rol);
      router.replace("/cuidador"); // fallback
    }
  } else {
    console.log("No hay usuario, redirigiendo a login");
    router.replace("/login");
  }
}, [user, isReady]);


  return (
    <View className="flex-1 justify-center items-center">
      <Text>Redirigiendo...</Text>
    </View>
  );
}