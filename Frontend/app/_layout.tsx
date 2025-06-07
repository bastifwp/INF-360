import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Stack, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import './globals.css';

function HeaderCEApp() {

  const router = useRouter();
  /*
  const fadeAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }, []);

      const handlePress = () => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          router.back();
        });
      };
  */
  return (
    <View className="flex-row bg-primary h-24 justify-center items-center">
      {router.canGoBack() && (
        <TouchableOpacity onPress={() => router.replace("../")} className="absolute left-4">
          <Image source={icons.back} className="h-10 w-10" style={{tintColor: "#ebebeb"}}/>
        </TouchableOpacity>
      )}
      <Image
        source={images.logo}
        className="mr-3 h-16 w-16 align-middle"
      />
      <Text className="text-xl text-light font-extrabold align-middle">CEApp</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          header: () => <HeaderCEApp/>
        }}
      />
    </>
  );
}
