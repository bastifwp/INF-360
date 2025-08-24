import { Titulo } from "@/components/Titulo";
import { colores } from "@/constants/colores";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/auth";
import Constants from "expo-constants";
import { usePathname } from "expo-router";

const WS_BASE_URL = Constants.expoConfig?.extra?.wsBaseUrl;
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;


export default function Chat() {

  //Obtenemos usuario y token del contexto
  const {user, authToken, refreshToken, setAuthToken, createApi} = useAuth();
  const pathname = usePathname(); 

  //Sacamos el plan_id de la URL
  const plan_id = pathname.split("/")[2].split("-")[0];



  //ESTADOS
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [inputHeight, setInputHeight] = useState(40); // altura inicial mínima
  
  const [fechaUltimaLectura, setFechaUltimaLectura] = useState(
    new Date("2025-08-01T20:00:00")
  );
   
  //Estado para saber cuando se abrió el chat 
  const [fechaAperturaChat] = useState(new Date()) //Se inicializa una unica vez


  const ws = useRef<WebSocket | null>(null);


  // ------ Nos conectaos al websocket al entrar a la vista
  useEffect(() => {
    if(!plan_id) return //Si la ruta está mala (no tiene plan id)


    //Fetch old messages y última lectura
    const fetchData  = async () => {
      try{

      
        const api = createApi(authToken, refreshToken, setAuthToken);
        console.log("[Chat] Obteniendo mensajes antiguos de base de datos...");
        const res = await api.get(`${API_BASE_URL}/chat/${plan_id}/mensajes/`);
      

        //Configuramos los mensajes para que luego se rendericen como estaba planeado en el frontend
        const oldMessages = res.data.map((msg: any) => ({
          id: msg.id,
          nombre: msg.user,
          mensaje: msg.text,
          propio: msg.user === user?.email,
          fecha: msg.timestamp ? new Date(msg.timestamp) : new Date(), //En caso que timestamp sea null
        }));
        

        //Seteamos los mensajes que ya estaban
        setMensajes(oldMessages);
        console.log("[Chat] Mensajes obtenidos") ;

        //Ahora pedimos la ultima lectura
        console.log("[Chat] Obteniendo última lectura...");
        const lecturaRes = await api.get(`${API_BASE_URL}/chat/${plan_id}/ultima-lectura/`);
        //Asignamos variable
        if (lecturaRes.data.ultima_lectura) {
            setFechaUltimaLectura(new Date(lecturaRes.data.ultima_lectura));
        }
        console.log("[Chat] Última lectura obtenida");

        //#########################################################################
        //¿¿¿¿¿¿¿¿¿En caso que sea null entonces que hace el frontend???????
        //#########################################################################

      } catch (err){
        console.log("[Chat] Error pidiendo infomración a la base de datos", err);
      }
      
    }

    //LLamamos a la función para pedir mensajes antiguos y conectamos web socket
    const init = async () => {
      await fetchData();

      //Nos conectamos al web socket para recibir nuevos mensajes
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
            id: Date.now(), //Este es temporal, luego se guarda en la bd con la id correspondiente
            nombre: data.user,
            mensaje: data.message,
            propio: data.user === user?.email,
            fecha: data.timestamp ? new Date(data.timestamp) : new Date(), //Si el mensaje viene con timestamp null
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
    }
    init();
    
    return () => {
      //Al salir de la vista actualizamos la fecha de última lectura
      const updateLectura = async () => {
        try {
          const api = createApi(authToken, refreshToken, setAuthToken);
          const ahora = new Date().toISOString();
          await api.patch(`${API_BASE_URL}/chat/${plan_id}/ultima-lectura/`, {
            ultima_lectura: ahora
          });
          console.log("[Chat] Última lectura actualizada");
        } catch (err) {
          console.log("[Chat] Error actualizando última lectura", err);
        }
      };
      updateLectura();

      //Cerramos web socket 
      ws.current?.close();
    };


  }, [plan_id, authToken]);


  // -------- Función pare enviar mensaje ---------------
  // Estoy pensando que esto quizas haya que cambiarlo un poco para poder hacer esto de intentar re-enviar el mensaje.
  const enviarMensaje = () => {
    if (!texto.trim() || !ws.current) return; //Si no hay mensaje o si no está la conexión con websocket no podemos enviar.
   
    console.log("Sending message");
    ws.current.send(JSON.stringify({
      planid: plan_id,
      message: texto,
      date: new Date().toISOString() //Para que se guarde correctamente en la base de datos
    }));

    console.log("Message sent");
    setTexto("");
  };




  // Función para formatear fechas a texto
  const formatearFecha = (fecha: any) => {
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return fecha.toLocaleDateString(undefined, opciones);
  };

  // Obtener solo fecha sin hora para comparar días
  //const getFechaDia = (fecha: any) => fecha.toISOString().split("T")[0];
  const getFechaDia = (fecha: Date) => {
    const soloFecha = new Date(fecha);
    soloFecha.setHours(0, 0, 0, 0); // resetea la hora a 00:00:00.000
    return soloFecha;
  };


  // Construir array con separadores por día y separador "nuevos mensajes"
  const mensajesConSeparadores = useMemo(() => {
    let resultado = [];
    let diaAnterior = null;
    let separadorNuevosInsertado = false;

    // Ordenar mensajes cronológicamente (vienene ordenados del backend)
    const mensajesOrdenados = mensajes//.slice().sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    for (const msg of mensajesOrdenados) {
      const diaMsg = getFechaDia(msg.fecha);
      // Insertar separador de nuevos mensajes solo si:
      // - msg.fecha > fechaUltimaLectura (no se había leído aún)
      // - msg.fecha < fechaAperturaChat (llegó antes de abrir el chat)
      // - separador aún no insertado
      if (
        !separadorNuevosInsertado &&
        msg.fecha > fechaUltimaLectura && //Compara dos tipos de datos Date
        msg.fecha < fechaAperturaChat
      ) {
        resultado.push({
          id: "separador-nuevos",
          tipo: "nuevo-separador",
        });
        separadorNuevosInsertado = true;
      }

      // Insertar separador de fecha si cambia el día
      if (!diaAnterior || diaMsg.getTime() !== diaAnterior.getTime())  {
        resultado.push({
          id: `separador-fecha-${diaMsg}`,
          tipo: "separador-fecha",
          fecha: msg.fecha,
        });
        diaAnterior = diaMsg;
      }

      resultado.push({
        ...msg,
        tipo: "mensaje",
      });
    }


    return resultado;

  }, [mensajes, fechaUltimaLectura, fechaAperturaChat]);


  return (
    
    <View className="flex-1">

      <Titulo>Chat</Titulo>

      <View className="flex-1"
        style={{
          borderTopWidth: 0.5,
          borderTopColor: colores.mediumgrey,
        }}
      >

        <FlatList
          data={mensajesConSeparadores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {

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

            // Mensajes normales
            return (
              <View
                className="p-2 max-w-[80%]"
                style={{ alignSelf: item.propio ? "flex-end" : "flex-start" }}
              >
                <Text className="text-black text-base font-semibold">{item.nombre}</Text>
                <View
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: item.propio ? colores.lightblue : colores.lightpurple }}
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
            borderTopColor: colores.mediumgrey
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
