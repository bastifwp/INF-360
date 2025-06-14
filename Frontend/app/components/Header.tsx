import { useRouter, usePathname } from "expo-router";
import { TouchableOpacity, Image, View, Text, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants/images";
import { useDescartarCambios } from "../context/DescartarCambios";

export default function Header() {
  const router = useRouter();
  const pathname = decodeURIComponent(usePathname());
  const { handleDescartarCambios } = useDescartarCambios();

  if (!pathname) return null;
  const pathParts = pathname.split("/").filter(Boolean);
  const userType = pathParts[0];
  const paciente = pathParts[1];

  let backRoute = null;
  let iconName = "arrow-back";
  let shouldShowAlert = false;
  let shouldUseHandleDescartar = false;

  if (pathname.includes("/objetivo")) {
    backRoute = `/${userType}/${paciente}/plan`;
    shouldUseHandleDescartar = true;
  } else if (pathname.includes("/entrada")) {
    backRoute = `/${userType}/${paciente}/bitacora`;
  } else if (pathParts.length === 2) {
    backRoute = `/${userType}`;
  } else if (pathParts.length === 1) {
    backRoute = `/login`;
    iconName = "log-out-outline";
    shouldShowAlert = true;
  }

  const handlePress = () => {
    if (shouldUseHandleDescartar && handleDescartarCambios) {
      handleDescartarCambios(backRoute);
    } else if (shouldShowAlert) {
      Alert.alert(
        "¿Cerrar sesión?",
        "¿Estás segur@ de que deseas salir?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => router.replace(backRoute),
          },
        ]
      );
    } else {
      router.replace(backRoute);
    }
  };

  return (
    <View className="flex-row bg-primary h-20 justify-center items-center">
      {backRoute && (
        <TouchableOpacity onPress={handlePress} className="absolute left-4">
          <Ionicons name={iconName} size={32} color="#ebebeb" />
        </TouchableOpacity>
      )}
      <View className="flex-row">
        <Image source={images.logo} className="mr-3 h-12 w-12 align-middle" />
        <Text className="text-3xl text-light font-extrabold align-middle">CEApp</Text>
      </View>
    </View>
  );
}
