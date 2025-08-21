import React from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import { IconoObjetivo } from "@/components/Icono";
import { Etiqueta } from "@/components/Etiqueta";
import { TituloSeccion } from "@/components/Titulo";
import { TarjetaExpandido } from "@/components/Tarjeta";
import { BotonEditar, BotonEliminar } from "@/components/Boton";

const categoriaColores = {
  Comunicación: '#4f83cc', // Azul
  Motricidad: '#81c784',   // Verde
  Cognición: '#f48fb1',    // Rosado
  Conducta: '#ffb74d',     // Naranjo
  default: '#b0bec5'       // Gris por defecto
};

const ObjetivoItem = ({ objetivo, onChange }) => {

  const { authToken, refreshToken, createApi, setAuthToken } = useAuth();

  const router = useRouter();

  const pathname = usePathname();
  const isProfesional = pathname.includes("/profesional");
  
  const { paciente } = useLocalSearchParams();

  const colorCategoria = categoriaColores[objetivo.categoria] || categoriaColores.default;

  const handleEditar = () => {
    router.push(`/profesional/${paciente}/plan/objetivo-editar?id=${objetivo.id}`);
  };

  const handleEliminar = () => {
    Alert.alert(
      "Eliminar objetivo",
      `¿Estás segur@ que quieres eliminar "${objetivo.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => {console.log("[plan: objetivos] Eliminando objetivo:", objetivo.id);
          {
            if (!authToken || !refreshToken) return;
            const api = createApi(authToken, refreshToken, setAuthToken);
            api
              .delete("/objetivos/detalle/" + objetivo.id + "/", {timeout:5000})
              .then(res => {console.log("[plan: objetivos] Respuesta:", res.status);
                            onChange()})
              .catch(err => {if (!err.request){console.log("[plan: objetivos] Error:", err.message);}
                            onChange();
              });
          } 
        }, style: "destructive" },
      ]
    );
  };

  return (
    <TarjetaExpandido
      titulo={objetivo.titulo}
      subtitulo={[
        `Fecha: ${objetivo.fecha_creacion}`,
        `Autor: ${objetivo.autor_creacion}`,
      ]}
      icono={
        <IconoObjetivo
          color={colorCategoria}
          iconoTipo={"bulb-outline"}
        />
      }
      expandidoContenido={
        <>
          <View className="bg-light rounded-lg p-2 my-2">
            <Text className="text-black">{objetivo.descripcion}</Text>
          </View>
          <View className="mb-2">
            <TituloSeccion children={"Categoría:"} />
            <Etiqueta
              texto={objetivo.categoria}
              colorFondo={colorCategoria}
            />
          </View>
          {objetivo.autor_modificacion && objetivo.fecha_modificacion && (
            <Text className="text-mediumdarkgrey text-sm mb-2">
              Última modificación por {objetivo.autor_modificacion} el {objetivo.fecha_modificacion}
            </Text>
          )}
          {isProfesional
            ? <View className="flex-row justify-between">
                <BotonEditar tipo="objetivo" onPress={handleEditar} />
                <BotonEliminar tipo="objetivo" onPress={handleEliminar} />
              </View>
            : null
          }
        </>
      }
    />
  );
};

export function ListaObjetivos({ objetivos, onChange }) {
  return (
    <FlatList
      data={objetivos}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ObjetivoItem objetivo={item} onChange={onChange} />}
      contentContainerStyle={{ paddingBottom: 55 }}
    />
  );
};