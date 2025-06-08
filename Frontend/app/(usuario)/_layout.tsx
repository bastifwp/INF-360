import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/Header";

// VISTA: usuario (sin paciente seleccionado)
export default function LayoutUsuario() {
  return (
    <>
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <Slot />
        </SafeAreaView>
    </>
  );
}