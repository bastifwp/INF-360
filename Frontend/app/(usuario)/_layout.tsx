import { Slot } from "expo-router";
import { View } from "react-native";

import Header from "../components/Header";

export default function LayoutUsuario() {
  return (
    <>
        <View style={{ flex: 1 }}>
            <Header />
            <Slot />
        </View>
    </>
  );
}