import { Slot } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "./context/auth";
import { SafeAreaView } from "react-native-safe-area-context";

import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar hidden={false} className="bg-primary" />
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </AuthProvider>
  );
}