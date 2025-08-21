import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { colors } from "@/constants/colors";
import { Etiqueta } from "@/components/base/Etiqueta";
import { TarjetaExpandido } from "@/components/base/Tarjeta";
import { MensajeVacio } from "@/components/base/MensajeVacio";
import { Titulo, TituloSeccion } from "@/components/base/Titulo";
import { IndicadorCarga } from "@/components/base/IndicadorCarga";
import { BotonAgregar, BotonAccion } from "@/components/base/Boton";


const mock = [
  {
    id: 1,
    nombre: "Dra. Valentina Ríos",
    correo: "valentina.rios@salud.cl",
    institucion: "Centro de Atención Infantil",
    cargo: "Psicóloga Clínica",
  },
  {
    id: 2,
    nombre: "Dr. Nicolás Fuentes",
    correo: "nicolas.fuentes@hospital.cl",
    institucion: "Hospital del Niño",
    cargo: "Neurólogo Pediátrico",
  },
  {
    id: 3,
    nombre: "María José Pérez",
    correo: "mj.perez@fundacion.cl",
    institucion: "Fundación Apoyo Azul",
    cargo: "Terapeuta Ocupacional",
  },
];

//ITEM: PROFESIONAL
const ProfesionalItem = ({ profesional, isProfesional }) => {
  //HANDLE: DESHABILITAR PROFESIONAL
  const handleDeshabilitarProfesional = () => {
    Alert.alert(
      "Deshabilitar profesional",
      `¿Estás segur@ que quieres deshabilitar a "${profesional.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => {
          console.log("[equipo] Deshabilitando profesional:", profesional.id);
        }, style: "destructive" },
      ]
    );
  };
  //VISTA
  return (
    <TarjetaExpandido
      titulo={profesional.nombre}
      subtitulo={[
        `${profesional.cargo}`,
        `${profesional.institucion}`,
      ]}
      icono = {<Ionicons name="person-circle-outline" size={50} color="black"/>}
      expandidoContenido={
        <View className="gap-2">
          <View className="gap-2">
            <TituloSeccion
              children={"Correo electrónico:"}
            />
            <Etiqueta
              texto={`${profesional.correo}`}
              iconoNombre={"mail-open-outline"}
              fondoColor={colors.primary}
              colorTexto={colors.white}
            />
          </View>
          {isProfesional
            ? null
            : <View className="gap-2">
                <TituloSeccion
                  children={"Opciones:"}
                />
                <View className="flex-row flex-wrap justify-between gap-1">
                  <BotonAccion
                    texto="Deshabilitar"
                    onPress={handleDeshabilitarProfesional}
                    iconoNombre="person-remove-outline"
                    iconoColor={colors.mediumred}
                    fondoColor={colors.lightred}
                  />
                </View>
              </View>
          }
        </View>
      }
    />
  )
}

//LISTA: PROFESIONALES
const ListaProfesionales = ({ profesionales, isProfesional }) => {
  //VISTA
  return (
    <View className="flex-1 gap-2">
      <FlatList
        data={profesionales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProfesionalItem profesional={item} isProfesional={isProfesional}/>}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

export function EquipoPaciente() {
  //En esta vista se deben mostrar los profesionales en el plan de trabajo del paciente actual (ocupar tarjetas)
  //si es cuidador, cada profesional debe tener un botón para eliminar
  //si es cuidador, debe tener una opción de agregar más profesionales

  const { authToken, refreshToken, createApi, setAuthToken, user } = useAuth();
  const isProfesional = user?.role === "profesional";

  const router = useRouter();

  const { paciente } = useLocalSearchParams();

  //ESTADOS
  const [equipo, setEquipo] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchEquipo();
  }, [authToken, refreshToken]);

  //FETCH: EQUIPO
  const fetchEquipo = async () => {
    if (!authToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const api = createApi(authToken, refreshToken, setAuthToken);
      console.log("[equipo] Obteniendo equipo de la base de datos...");
      //const res = await api.get()...
      setEquipo(mock);
      setIsLoading(false);
      setError(false);
    } catch (err) {
      console.log("[equipo] Error:", err);
      setIsLoading(false);
      setError(true);
    }
  }

  //HANDLE: AGREGAR-PROFESIONAL
  const handleAgregarProfesional = () => {
    console.log("[equipo] Agregando personas al equipo...");
    router.push(`/cuidador/${paciente}/equipo/equipo-agregar`);
  };

  //FILTRO
  const profesionalesBusqueda = equipo.filter((profesional) => {
    const textoBusqueda = busqueda.toLowerCase();
    const nombre = profesional.nombre?.toLowerCase() ?? "";
    const cargo = profesional.cargo?.toLowerCase() ?? "";
    const institucion = profesional.institucion?.toLowerCase() ?? "";
    const correo = profesional.correo?.toLowerCase() ?? "";
    return (
      nombre.includes(textoBusqueda) ||
      cargo.includes(textoBusqueda) ||
      institucion.includes(textoBusqueda) ||
      correo.includes(textoBusqueda)
    );
  });

  //VISTA
  return (
    <View className="flex-1">
      <Titulo onPressRecargar={fetchEquipo} onBusquedaChange={setBusqueda}>
        Equipo
      </Titulo>
      {isLoading ? (
        <IndicadorCarga/>
      ): error ? (
        <MensajeVacio
          mensaje={`Hubo un error al cargar el equipo.\nIntenta nuevamente.`}
          onPressRecargar={fetchEquipo}
        />
      ) : equipo.length === 0 ? (
        <MensajeVacio
          mensaje={
            isProfesional
              ? `Aún no tienes un equipo de trabajo.`
              : `Aún no tienes un equipo de trabajo.\n¡Añade profesionales al equipo usando el botón ＋!`
          }
        />
      ) : (
        <ListaProfesionales profesionales={profesionalesBusqueda} isProfesional={isProfesional}/>
      )}
      {isProfesional ? null : <BotonAgregar onPress={handleAgregarProfesional}/>}
    </View>
  );

}