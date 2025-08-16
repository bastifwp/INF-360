import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Titulo } from "@/components/base/Titulo";
import { colors } from "@/constants/colors";

export default function Chat() {

  //ESTADOS
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      nombre: "Dra. Ana Pérez",
      mensaje: "Hola equipo, revisemos el plan",
      propio: false,
      fecha: new Date("2025-08-01T09:15:00"),
    },
    {
      id: 2,
      nombre: "Tú",
      mensaje: "De acuerdo 👍",
      propio: true,
      fecha: new Date("2025-08-01T09:17:00"),
    },
    {
      id: 3,
      nombre: "Dr. Juan Soto",
      mensaje: "Yo ya actualicé mi parte",
      propio: false,
      fecha: new Date("2025-08-02T09:20:00"),
    },
    {
      id: 4,
      nombre: "Dr. Juan Soto",
      mensaje: "Yo ya actualicé mi parte",
      propio: false,
      fecha: new Date("2025-08-02T09:20:00"),
    },
    {
      id: 5,
      nombre: "Dr. Juan Soto",
      mensaje: "Yo ya actualicé mi parte",
      propio: false,
      fecha: new Date("2025-08-02T09:20:00"),
    },
  ]);
  const [fechaUltimaLectura, setFechaUltimaLectura] = useState(
    new Date("2025-08-01T20:00:00")
  );
   const [inputHeight, setInputHeight] = useState(40); // altura inicial mínima

  // Función para formatear fechas a texto
  const formatearFecha = (fecha) => {
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return fecha.toLocaleDateString(undefined, opciones);
  };

  // Obtener solo fecha sin hora para comparar días
  const getFechaDia = (fecha) => fecha.toISOString().split("T")[0];

  // Construir array con separadores por día y separador "nuevos mensajes"
  const mensajesConSeparadores = useMemo(() => {
  let resultado = [];
  let fechaAnterior = null;
  let separadorNuevosInsertado = false;

  // Ordenar mensajes cronológicamente
  const mensajesOrdenados = mensajes.slice().sort((a, b) => a.fecha - b.fecha);

  for (const msg of mensajesOrdenados) {
    const fechaMsg = getFechaDia(msg.fecha);
    // Insertar separador de nuevos mensajes solo una vez antes del primer mensaje más reciente que fechaUltimaLectura
    if (!separadorNuevosInsertado && msg.fecha > fechaUltimaLectura) {
      resultado.push({
        id: "separador-nuevos",
        tipo: "nuevo-separador",
      });
      separadorNuevosInsertado = true;
    }
    // Insertar separador de fecha si cambia el día
    if (fechaMsg !== fechaAnterior) {
      resultado.push({
        id: `separador-fecha-${fechaMsg}`,
        tipo: "separador-fecha",
        fecha: msg.fecha,
      });
      fechaAnterior = fechaMsg;
    }
    resultado.push({
      ...msg,
      tipo: "mensaje",
    });
  }
  return resultado;
  }, [mensajes, fechaUltimaLectura]);

  const enviarMensaje = () => {
    if (!texto.trim()) return;
    const nuevoMensaje = {
      id: mensajes.length + 1,
      nombre: "Tú",
      mensaje: texto,
      propio: true,
      fecha: new Date(),
    };
    setMensajes([...mensajes, nuevoMensaje]);
    setTexto("");
  };

  return (

    <View className="flex-1">

      <Titulo>Chat</Titulo>

      <View className="flex-1"
        style={{
          borderTopWidth: 0.5,
          borderTopColor: colors.mediumgrey,
        }}
      >

        <FlatList
          data={mensajesConSeparadores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            
            if (item.tipo === "nuevo-separador") {
              return (
                <View className="flex-row items-center my-1">
                  <View className="flex-1 h-px bg-secondary" />
                  <View className="bg-secondary rounded-full px-4 py-1 items-center">
                    <Text className="text-white text-sm">Nuevos mensajes</Text>
                  </View>
                  <View className="flex-1 h-px bg-secondary" />
                </View>
              );
            }

            if (item.tipo === "separador-fecha") {
              return (
                <View className="bg-mediumdarkgrey rounded-full px-4 py-1 my-2 items-center self-center">
                  <Text className="text-white text-sm">{formatearFecha(item.fecha)}</Text>
                </View>
              );
            }

            // Mensajes normales
            return (
              <View
                className="p-2 max-w-[80%]"
                style={{ alignSelf: item.propio ? "flex-end" : "flex-start" }}
              >
                <Text className="text-black text-base font-semibold">{item.nombre}</Text>
                <View
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: item.propio ? colors.lightblue : colors.lightpurple }}
                >
                  <Text className="text-black text-base">{item.mensaje}</Text>
                </View>
                <Text className="text-black text-xs text-right">{item.fecha.toLocaleTimeString()}</Text>
              </View>
            );
          }}
        />

        <View
          className="bg-light pb-4 pt-2 flex-row items-end"
          style={{
            borderTopWidth: 0.5,
            borderTopColor: colors.mediumgrey
          }}
        >
          <TextInput
            className="bg-lightgrey text-black rounded-lg p-2 flex-1"
            style={{
              minHeight: 40,
              maxHeight: 200,
              height: inputHeight,
              textAlignVertical: "top",
            }}
            placeholder="Escribe un mensaje..."
            value={texto}
            onChangeText={setTexto}
            multiline
            maxLength={500}
            onContentSizeChange={(e) => setInputHeight(Math.max(40, e.nativeEvent.contentSize.height))}
          />

          <TouchableOpacity
            className="bg-secondary rounded-full p-2 ml-2 justify-center items-center"
            onPress={enviarMensaje}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
