import { Stack, Slot, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

export default function Header() {
  const router = useRouter();

  return (
    <View className="flex-row bg-primary h-24 justify-center items-center">
      {router.canGoBack() && (
        <TouchableOpacity onPress={() => router.replace("../")} className="absolute left-4">
          <Image source={icons.back} className="h-10 w-10" style={{ tintColor: "#ebebeb" }} />
        </TouchableOpacity>
      )}
      <Image source={images.logo} className="mr-3 h-16 w-16 align-middle" />
      <Text className="text-xl text-light font-extrabold align-middle">CEApp</Text>
    </View>
  );

}