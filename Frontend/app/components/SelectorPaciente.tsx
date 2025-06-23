import { Text, View, TouchableOpacity,  ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from "../context/auth";
//import {createApi} from '../api';


//const { authToken } = useAuth();

const pacientes = [
  { id: "1", nombre: "Juanita Pérez", cuidador: "J. PG"},
  { id: "2", nombre: "Juan Pérez", cuidador: "Alice López"},
  { id: "3", nombre: "María López", cuidador: "Bob López"},
];

/*
const get_pac = async (email: string, password: string): Promise<any> => {
  try{
    const pac = await axios.get("http://192.168.185.65:8000/profesional-plan-trabajo/",
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    )

  }
  catch(error: unknown){
    console.log(" Failed first req ")

  }
  
}
*/
// const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

// useEffect(() => {

//   if (!authToken || !refreshToken) return;

//   const api = createApi(authToken, refreshToken, setAuthToken);

//    api
//       .get('/profesional-plan-trabajo/')
//       .then(res => console.log(res.data))
//       .catch(err => console.log(err));
//  },[authToken, refreshToken]); // 👈 se ejecuta cada vez que cambien



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
    
  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();
  const [pacientes, setPacientes] = useState([]);


  useEffect(() => {
  

    if (!authToken || !refreshToken) return;

    const api = createApi(authToken, refreshToken, setAuthToken);

    api
        .get('/profesional-plan-trabajo/')
        .then(res => {setPacientes(res.data);console.log(res.data);})
        .catch(err => console.log(err));
  },[authToken, refreshToken]); // 👈 se ejecuta cada vez que cambien


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