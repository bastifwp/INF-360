// components/CustomFooter.tsx
import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { icons } from "@/constants/icons";
import { useLocalSearchParams } from "expo-router";

const FooterItem = ({ icon, label, isActive, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image
      source={icon}
      style={{
        width: 24,
        height: 24,
        tintColor: isActive ? "#FFFFFF" : "#bdbbb3",
        marginTop: 12,
      }}
    />
    <Text
      style={{
        color: isActive ? "#FFFFFF" : "#bdbbb3",
        marginTop: 9,
        fontSize: 12,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function CustomFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const { paciente } = useLocalSearchParams();

  const items = [
    { route: `/profesional/${paciente}`, icon: icons.inicio, label: "Inicio" },
    { route: `/profesional/${paciente}/plan`, icon: icons.plan, label: "Plan" },
    { route: `/profesional/${paciente}/bitacora`, icon: icons.bitacora, label: "Bitácora" },
    { route: `/profesional/${paciente}/chat`, icon: icons.chat, label: "Chat" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#114F80",
        borderRadius: 50,
        marginHorizontal: 10,
        marginBottom: 10,
        height: 70,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {items.map((item) => (
        <FooterItem
          key={item.route}
          icon={item.icon}
          label={item.label}
          isActive={pathname.startsWith(item.route)}
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  );
}
