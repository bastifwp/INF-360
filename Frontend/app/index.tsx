import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { MensajeVacio } from "@/components/MensajeVacio";

export default function Index() {

  const router = useRouter();

  const { user } = useAuth();
  
  //ESTADOS
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user === undefined) return;
    console.log("[index] Usuario autenticado:", user);
    if (user) {
      if (user.role === "profesional") {
        console.log("[index] Redirigiendo a profesional...");
        router.replace("/profesional");
      } else if (user.role === "cuidador") {
        console.log("[index] Redirigiendo a cuidador...");
        router.replace("/cuidador");
      } else {
        console.log("[index] Rol no reconocido:", user.role);
        router.replace("/login");
      }
    } else {
      console.log("[index] Redirigiendo a login...");
      router.replace("/login");
    }
  }, [user, isReady]);

  //VISTA
  return (
    <MensajeVacio mensaje={`Redirigiendo...`}/>
  );

}