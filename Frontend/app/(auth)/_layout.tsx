import { Slot, usePathname, useRouter } from "expo-router";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { images } from "@/constants/images";
import { BotonEsquinaSuperior } from "@/components/base/Boton";

export default function LayoutAuth() {

  const router = useRouter();

  const pathname = usePathname();

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary">

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <View className="flex-1 bg-primary px-6 py-10 justify-center">

          {pathname === "/registro" && (
            <BotonEsquinaSuperior
              tipo={"izquierda"}
              iconName="arrow-back"
              onPress={() => router.push("/login")}
            />
          )}

          <View className="mb-4 flex-row items-center justify-center">
            <Image
              source={images.logo}
              className="mr-2"
              style={{
                width: Platform.OS === "web" ? 48 : 80,
                height: Platform.OS === "web" ? 48 : 80
              }}
              resizeMode="contain"
            />
            <Text className="text-white text-4xl font-bold">CEApp</Text>
          </View>

          <View className="bg-light rounded-2xl px-4 py-8">
            <Slot />
          </View>
          
        </View>

      </ScrollView>

    </KeyboardAvoidingView>

  );

}
