import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from 'react-native-svg';

export function IconoObjetivo({ color }) {
  return (
    <View className="relative w-[50px] h-[50px]">
      <Ionicons name="ellipse" size={50} color={color} />
    </View>
  )
}

export function IconoEntrada({ colores, emoji }) {
  return (
    <View className="w-[50px] h-[50px] relative">
      <IconoColores colores={colores} />
      <View className="absolute top-0 left-1 flex items-center justify-center">
        <Text className="text-xl text-center">{emoji}</Text>
      </View>
    </View>
  );
}

export function IconoColores({ colores }) {
  const size = 50;
  const radius = 20;
  const center = size / 2;
  const total = colores.length;
  if (total === 1) {
    return (
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} fill={colores[0]} />
      </Svg>
    );
  }
  const angleStep = 360 / total;
  let paths = [];
  for (let i = 0; i < total; i++) {
    const startAngle = angleStep * i;
    const endAngle = angleStep * (i + 1);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const startX = center + radius * Math.cos((Math.PI / 180) * startAngle);
    const startY = center + radius * Math.sin((Math.PI / 180) * startAngle);
    const endX = center + radius * Math.cos((Math.PI / 180) * endAngle);
    const endY = center + radius * Math.sin((Math.PI / 180) * endAngle);
    const d = `M${center},${center} L${startX},${startY} A${radius},${radius} 0 ${largeArc} 1 ${endX},${endY} Z`;
    paths.push(<Path key={i} d={d} fill={colores[i]} />);
  }
  return (
    <Svg width={size} height={size}>
      {paths}
    </Svg>
  );
};