import React from "react";
import { View } from "react-native";
import { Link, useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { Titulo } from "@/components/Titulo";
import { MensajeVacio } from "@/components/MensajeVacio";
import { BotonAgregar } from "@/components/Boton";
  
export function EquipoPaciente() {
  //En esta vista se deben mostrar los profesionales en el plan de trabajo del paciente actual (ocupar tarjetas)
  //si es cuidador, cada profesional debe tener un botón para eliminar
  //si es cuidador, debe tener una opción de agregar más profesionales

  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const router = useRouter();

  const { paciente } = useLocalSearchParams();

  const pathname = usePathname();
  const isProfesional = pathname.includes("/profesional");

  //HANDLE: AGREGAR-PROFESIONAL
  const handleAgregarProfesional = () => {
    console.log("[equipo] Agregando personas al equipo...")
    router.push(`/cuidador/${paciente}/equipo/equipo-agregar`);
  }

  return (
    <View className="flex-1">
      <Titulo>Equipo</Titulo>
      <MensajeVacio mensaje={`En construcción...`}/>
      {isProfesional 
        ? null
        : <BotonAgregar onPress={handleAgregarProfesional}/>
      }
    </View>
  )
}