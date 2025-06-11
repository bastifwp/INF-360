import { Pressable, Text, View } from "react-native";

interface RadioButtonProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export default function RadioButton({
  label,
  value,
  selected,
  onSelect,
}: RadioButtonProps) {
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className="flex-row items-center mb-4"
    >
      <View className="w-5 h-5 mr-2 rounded-full border border-gray-400 justify-center items-center">
        {selected && <View className="w-3 h-3 rounded-full bg-blue-600" />}
      </View>
      <Text className="text-gray-800">{label}</Text>
    </Pressable>
  );
}