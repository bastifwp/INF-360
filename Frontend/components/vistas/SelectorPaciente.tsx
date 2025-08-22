import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import { Titulo } from "@/components/base/Titulo";
import { Buscador } from "@/components/base/Buscador";
import { BotonAgregar } from "@/components/base/Boton";
import { TarjetaSelector } from "@/components/base/Tarjeta";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";

//ÍTEM: PACIENTE
const PacienteItem = ({ paciente, isProfesional }: { paciente: any; isProfesional: boolean }) => {
  return (
    <Link
      key={paciente.id}
      href={`/${isProfesional ? "profesional" : "cuidador"}/${paciente.id}-${encodeURIComponent(paciente.nombre)}`}
      asChild
    >
      <TarjetaSelector
        titulo={paciente.nombre}
        subtitulo={isProfesional ? `Cuidador: ${paciente.cuidador}` : null}
        icono = {<Ionicons name="heart-circle-outline" size={50} color="black"/>}
        onPress={() => {}}
      />
    </Link>
  );
};

//LISTA: PACIENTES
const PacienteLista = ({ pacientes, isProfesional }) => {
  return (
    <FlatList
      data={pacientes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PacienteItem paciente={item} isProfesional={isProfesional} />}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};

export function SelectorPaciente() {

  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  const primer_nombre = user?.nombre.split(" ")[0];
  const isProfesional = user?.role === "profesional";

  const router = useRouter();

  //ESTADOS
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchPacientes();
  }, [authToken, refreshToken]);

  //FETCH: PACIENTES
  const fetchPacientes = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[selector-paciente] Obteniendo pacientes de la base de datos...");
      const res = await api.get("/profesional-plan-trabajo/");
      setPacientes(res.data);
      setIsLoading(false);
      setError(false);
    } catch (err) {
      console.log("[selector-paciente] Error:", err);
      setIsLoading(false);
      setError(true);
    }
  }

  //HANDLE: AGREGAR-PACIENTE
  const handleAgregarPaciente = () => {
    if(isProfesional){
      console.log("[selector-paciente] Agregando paciente...")
      router.push(`/profesional/paciente-agregar`);
    }
    else{
      console.log("[selector-paciente] Agregando paciente...")
      router.push(`/cuidador/paciente-agregar`);
    }
  }

  //FILTRO
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const textoBusqueda = busqueda.toLowerCase();
    const nombre = paciente.nombre?.toLowerCase() ?? "";
    const cuidador = paciente.cuidador?.toLowerCase() ?? "";
    return (
      nombre.includes(textoBusqueda) ||
      cuidador.includes(textoBusqueda)
    )
  });

  //VISTA
  return (
    <View className="flex-1 p-4">
      <View className="justify-center items-center">
        <Titulo>
          {`¡Bienvenid@, ${primer_nombre}!`}
          </Titulo>
        <Text className="text-base text-secondary font-bold pb-4">
          Selecciona un paciente para comenzar:
        </Text>
      </View>
      <View className="flex-1">
        {isLoading ? (
          <IndicadorCarga/>
        ) : error ? (
          <MensajeVacio
            mensaje={`Hubo un error al cargar los pacientes.\nIntenta nuevamente.`}
            onPressRecargar={() => fetchPacientes()}
          />
        ) : pacientes.length === 0 ? (
          <MensajeVacio
            mensaje={
              isProfesional
                ? `Aún no tienes pacientes asignados.\nComienza a integrarte en un plan de trabajo usando el botón +`
                : `Aún no tienes pacientes asignados.\n¡Comienza a planificar el trabajo del paciente usando el botón ＋!`
            }
          />
        ) : (
          <>
            <Buscador
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              placeholder={"Buscar..."}
              icono={true}
            />
            <PacienteLista pacientes={pacientesFiltrados} isProfesional={isProfesional}/>
          </>
        )}
      </View>
      <BotonAgregar onPress={handleAgregarPaciente}/>
    </View>
  );
}