import { Text, View, Image, TouchableOpacity,  ScrollView } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const pacientes = [
  { id: "1", nombre: "Juanita Pérez", cuidador: "J. PG"},
  { id: "2", nombre: "Juan Pérez", cuidador: "Alice López"},
  { id: "3", nombre: "María López", cuidador: "Bob López"},
];

const avatarPlaceholder = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const PacienteItem = ({ paciente, rol }: { paciente: any, rol: string }) => {
  return (
    <Link
      href={`/${rol}/${paciente.id}-${encodeURIComponent(paciente.nombre)}`}
      asChild
    >
      <TouchableOpacity
        style={{
          padding: 12,
          backgroundColor: '#f0f4f8',
          marginVertical: 6,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: paciente.avatar || avatarPlaceholder }}
          style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{paciente.nombre}</Text>
          {rol !== "cuidador" && (
  <Text style={{ color: '#555' }}>Cuidador: {paciente.cuidador}</Text>
)}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#555" />
      </TouchableOpacity>
    </Link>
  );
};

export default function SelectorPaciente({
    rol,
    nombre,
  }: {
    rol: "profesional" | "cuidador";
    nombre: string;
  }) {

  const primer_nombre = nombre.split(" ")[0];

  return (

    <View className="flex-1 bg-white p-4">

      <View className="items-center">
        <Text className="text-3xl font-bold text-primary mb-3">
          ¡Bienvenid@, {primer_nombre}!
        </Text>
        <Text className="text-xl font-bold text-secondary mb-6">
          Selecciona un paciente para comenzar
        </Text>
      </View> 

      {/* Lista de pacientes */}
      <ScrollView>
        {pacientes.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-lg text-gray-500">Aún no tienes pacientes asignados.</Text>
          </View>
        ) : (
          <View>
            {pacientes.map((paciente) => (
              <PacienteItem key={paciente.id} paciente={paciente} rol={rol} />
            ))}
          </View>
        )}
      </ScrollView>

    </View>

  );

}