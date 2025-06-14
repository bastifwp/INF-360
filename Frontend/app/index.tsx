import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { useAuth } from "./context/auth";

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

    console.log("[./app/index.tsx] Usuario autenticado:", user);

    if (user) {
      if (user.role === "profesional") {
        console.log("[./app/index.tsx] Redirigiendo a profesional...");
        router.replace("/profesional");
      } else if (user.role === "cuidador") {
        console.log("[./app/index.tsx] Redirigiendo a cuidador...");
        router.replace("/cuidador");
      } else {
        console.log("[./app/index.tsx] Rol no reconocido:", user.role);
        router.replace("/cuidador");
      }
    } else {
      console.log("[./app/index.tsx] Redirigiendo a login...");
      router.replace("/login");
    }
  }, [user, isReady]);

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Redirigiendo...</Text>
    </View>
  );

}