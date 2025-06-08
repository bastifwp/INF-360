import { Link } from "expo-router";
import { StatusBar, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";

const pacientes = [
  { id: "1", nombre: "Juanita Pérez", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: "2", nombre: "Juan Pérez", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: "3", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "4", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "5", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "6", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "7", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "8", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "9", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "10", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: "11", nombre: "María López", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
];

export default function InicioUsuarios() {
  return (
    <>

      <View className="flex-1 bg-white p-4">

        <Text className="text-3xl font-bold text-primary mb-6">¡Que bueno verte!</Text>

        <Text className="text-3xl font-bold text-secondary mb-6">Selecciona un paciente para comenzar</Text>

        <ScrollView>

          <View className="flex-row flex-wrap justify-between">

            {pacientes.map((paciente) => (
              <Link
                key={paciente.id}
                href={`/profesional/${paciente.nombre.replace(/\s+/g, "-")}`}
                className="w-40 m-2 bg-gray-100 rounded-lg p-4 items-center shadow"
              >
                <Image
                  source={{ uri: paciente.avatar }}
                  className="w-24 h-24 rounded-full mb-2"
                />
                <Text className="text-center text-base font-semibold">{paciente.nombre}</Text>
              </Link>
            ))}

          </View>

        </ScrollView>

      </View>

    </>

  );
  
}
