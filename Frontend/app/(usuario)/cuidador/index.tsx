import { Link, Stack } from "expo-router";
import { StatusBar, Text, View } from "react-native";

export default function Inicio() {
  return (
    <>
      <StatusBar hidden={false} className="bg-primary"/>
      <View className="flex-1 justify-center items-center">
        <Text className="text-5xl text-primary font-bold">Welcome Profesional!</Text>
        <Link href={"/profesional/Scarleth-Bazaes"}>Paciente Scarleth Bazaes</Link>
      </View>
    </>
  );
}