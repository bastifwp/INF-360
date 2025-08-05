import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { Titulo } from "@/components/Titulo";
import { BotonAgregar } from "@/components/Boton";
import { TarjetaSelector } from "@/components/Tarjeta";
import { MensajeVacio } from "@/components/MensajeVacio";
import { IndicadorCarga } from "@/components/IndicadorCarga";

const PacienteItem = ({ paciente, isProfesional }: { paciente: any; isProfesional: boolean }) => {
  return (
    <Link
      key={paciente.id}
      href={`/${isProfesional ? "profesional" : "cuidador"}/${paciente.id}-${encodeURIComponent(paciente.nombre)}`}
      asChild
    >
      <TarjetaSelector
        titulo={paciente.nombre}
        subtitulo={isProfesional ? `Cuidador: ${paciente.cuidador}` : undefined}
        icono = {<Ionicons name="heart-circle-outline" size={50} color="black"/>}
        onPress={() => {}}
      />
    </Link>
  );
};

export function SelectorPaciente() {

  const {authToken, refreshToken, createApi, setAuthToken} = useAuth();

  const router = useRouter();

  const pathname = usePathname();
  const isProfesional = pathname.includes("/profesional");

  const { user } = useAuth();
  const primer_nombre = user.nombre.split(" ")[0];

  //ESTADOS
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPacientes();
  }, [authToken, refreshToken]);

  //FETCH: PACIENTES
  const fetchPacientes = async (forzarRecargar = false) => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[selector-paciente] Obteniendo pacientes de la base de datos...");
      const res = await api.get("/profesional-plan-trabajo/")
      setPacientes(res.data);
      setIsLoading(false);
      setError(false);
    } catch (err) {
      console.log("[selector-paciente] Error:", err);
      setIsLoading(false);
      setError(true);
    }
  }

  const handleAgregarPaciente = () => {
    console.log("[selector-paciente] Agregando paciente...")
    router.push(`/cuidador/paciente-agregar`);
  }

  //VISTA
  return (
    <View className="flex-1 p-4">
      <View className="justify-center items-center">
        <Titulo>{`¡Bienvenid@, ${primer_nombre}!`}</Titulo>
        <Text className="text-xl text-secondary font-bold pb-4">
          Selecciona un paciente para comenzar:
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isLoading ? (
          <IndicadorCarga/>
        ) : error ? (
          <MensajeVacio
            mensaje={`Hubo un error al cargar los pacientes.`}
            recargar={true}
            onPress={() => fetchPacientes(true)}
          />
        ) : pacientes.length === 0 ? (
          <MensajeVacio
            mensaje={
              isProfesional
                ? `Aún no tienes pacientes asignados.`
                : `Sin pacientes por ahora.\n¡Comienza a planificar el trabajo del paciente usando el botón ＋!`
            }
          />
        ) : (
          <View>
            {pacientes.map((paciente) => (
              <PacienteItem
                key={paciente.id}
                paciente={paciente}
                isProfesional={isProfesional}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {isProfesional ? null : <BotonAgregar onPress={handleAgregarPaciente}/>}
    </View>
  );
}