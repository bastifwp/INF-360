import React from "react";
import { icons } from "@/constants/icons";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useRouter, usePathname, useLocalSearchParams } from "expo-router";

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
        marginBottom: 9,
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
    { route: `/cuidador/${paciente}`, icon: icons.inicio, label: "Inicio" },
    { route: `/cuidador/${paciente}/plan`, icon: icons.plan, label: "Plan" },
    { route: `/cuidador/${paciente}/recomendaciones`, icon: icons.bitacora, label: "Recomendaciones"},
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#114F80",
        borderRadius: 12,
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
          isActive={
            item.label === "Inicio"
              ? pathname === item.route
              : pathname === item.route || pathname.startsWith(item.route + "/")
          }
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  );
  
}
