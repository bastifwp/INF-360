import { Slot } from "expo-router";
import { View } from "react-native";
import { Header } from "@/components/Header";

export default function LayoutUsuario() {
  return (
    <>
      <Header />
      <View className="flex-1">
        <Slot />
      </View>
    </>
  );
}