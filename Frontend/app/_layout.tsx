import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/auth";
import "@/app/globals.css";

export default function LayoutRoot() {
  return (
    <AuthProvider>
      <StatusBar hidden={false} className="bg-primary" />
      <SafeAreaView className="flex-1 bg-light">
        <Slot />
      </SafeAreaView>
    </AuthProvider>
  );
}