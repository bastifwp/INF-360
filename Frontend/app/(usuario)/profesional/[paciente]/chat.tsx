import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Titulo } from "@/components/base/Titulo";
import { colors } from "@/constants/colors";

import { useAuth } from "@/context/auth";
import { usePathname } from "expo-router";
import Constants from "expo-constants";

const WS_BASE_URL = Constants.expoConfig?.extra?.wsBaseUrl;

export default function Chat() {

  //Obtenemos usuario y token del contexto
  const {user, authToken} = useAuth();
  const pathname = usePathname(); 

  //Sacamos el plan_id de la URL
  const plan_id = pathname.split("/")[2].split("-")[0];


  //ESTADOS
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [inputHeight, setInputHeight] = useState(40); // altura inicial mínima

  const ws = useRef<WebSocket | null>(null);


  // ------ Nos conectaos al websocket al entrar a la vista
  useEffect(() => {
    if(!plan_id) return //Si la ruta está mala (no tiene plan id)
    const socketUrl = WS_BASE_URL + `/chat/${plan_id}/?token=${authToken}`;
    ws.current = new WebSocket(socketUrl);

    //----------------------------
    //  Eventos del web socket
    //----------------------------

    //Conección con servidor
    ws.current.onopen = () => {
      console.log("Web Socket connected");
    } 


    //Recepción de mensajes desde el backend al frontend
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensaje recibido:", data);
    

      setMensajes( (prev) => [
        ...prev, //Prev son los mensajes que ya existian
        {
          id: Date.now(), //Esto lo puso chatgpt nJKNASDJ
          nombre: data.user,
          mensaje: data.message,
          propio: data.user === user?.email,
          fecha: new Date(),
          error: false,
          deleted: false
        },
      ]);
    };


    //Error en el web socket
    ws.current.onerror = (err) => {
      console.error("Error en WebSocket:", err);
    };   

    //Fin de conexión con el servidor
    ws.current.onclose = () => {
      console.log("🔌 WebSocket cerrado");
    };

    
    return () => {
      ws.current?.close();
    };


  }, [plan_id, authToken]);


  // -------- Función pare enviar mensaje ---------------
  // Estoy pensando que esto quizas haya que cambiarlo un poco para poder hacer esto de intentar re-enviar el mensaje.
  const enviarMensaje = (text: string) => {

    if (!text.trim() || !ws.current) return; //Si no hay mensaje o si no está la conexión con websocket no podemos enviar.
   
    console.log("Sending message");

    //Aqui habria que ponerle alguna condición como que el websocket no está abierto o algo así
    if(text == "error"){
      const nuevoMensaje = {
        id: mensajes.length + 1,
        nombre: "Tú",
        mensaje: text,
        propio: true,
        fecha: new Date(),
        error: true,
        deleted: false
      };
      console.log("Message failed")
      setMensajes([...mensajes, nuevoMensaje]);
    }
    else{
      ws.current.send(JSON.stringify({message: text}));
      console.log("Message sent");
      //setMensajes([...mensajes, nuevoMensaje]);
    }
     
    setTexto("");
  };



  /*
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
  ]);*/
  const [fechaUltimaLectura, setFechaUltimaLectura] = useState(
    new Date("2025-08-01T20:00:00")
  );
   

  // Función para formatear fechas a texto
  const formatearFecha = (fecha: any) => {
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return fecha.toLocaleDateString(undefined, opciones);
  };

  // Obtener solo fecha sin hora para comparar días
  const getFechaDia = (fecha: any) => fecha.toISOString().split("T")[0];

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

  const handleCancelarEnvio = (id) => {
    console.log("Borrando mensaje");
    setMensajes((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, deleted: true } : msg
      )
    );
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
                <View className="flex-row items-center my-2">
                  <View className="flex-1 h-px bg-secondary" />
                  <View className="bg-secondary rounded-full px-4 py-1 items-center">
                    <Text className="text-white text-base">Nuevos mensajes</Text>
                  </View>
                  <View className="flex-1 h-px bg-secondary" />
              </View>
              );
            }

            if (item.tipo === "separador-fecha") {
              return (
                <View className="bg-mediumdarkgrey rounded-full px-4 py-1 my-2 items-center self-center">
                  <Text className="text-white text-base">{formatearFecha(item.fecha)}</Text>
                </View>
              );
            }

            if(item.deleted) return ;

            // Mensajes normales
            return (
              <View
                className="p-2 max-w-[80%]"
                style={{ alignSelf: item.propio ? "flex-end" : "flex-start" }}
              >
                <Text className="text-black text-base font-semibold">{item.nombre}</Text>

                <View
                  className="p-2 rounded-xl flex-row items-center"
                  style={{
                    backgroundColor: item.error
                      ? colors.lightred
                      : item.propio
                      ? colors.lightblue
                      : colors.lightpurple,
                  }}
                >
                  <Text
                    className={`text-base px-1 ${
                      item.error ? "text-red-600 font-semibold" : "text-black"
                    }`}
                  >
                    {item.mensaje}
                  </Text>

                  {item.error && (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Mensaje no enviado",
                          "¿Qué quieres hacer con este mensaje?",
                          [
                            { text: "Reenviar", onPress: () => enviarMensaje(item.mensaje)},
                            { text: "Borrar", style: "destructive", onPress: () => handleCancelarEnvio(item.id)},
                            { text: "Salir", style: "cancel" },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="warning" size={20} color="#dc2626" />
                    </TouchableOpacity>
                  )}
                </View>

                <Text className="text-black text-xs text-right">
                  {item.fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
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
            onPress={() => enviarMensaje(texto)}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}
