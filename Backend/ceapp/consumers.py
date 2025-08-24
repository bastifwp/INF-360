from channels.generic.websocket import AsyncWebsocketConsumer
#from asgiref.sync import async_to_sync
from .models import CustomUser, PlanTrabajo, Mensaje
import json
from asgiref.sync import sync_to_async

#Consumer que maneja la logica de la ruta ws/chat/<plan_id>
class ChatConsumer(AsyncWebsocketConsumer):

    #------------------------------------------------------
    #      Función que maneja la conexión por socket
    #------------------------------------------------------
    async def connect(self):
        user = self.scope["user"]

        #verificamos si inició sesión
        if not user.is_authenticated:
            await self.close() #Rechazamos la conexión
            return

        #Si es que es válido extremos el plan_id desde la ruta
        self.plan_id = self.scope["url_route"]["kwargs"]["plan_id"]
        self.room_group_name = f"chat_{self.plan_id}"

        #Nos unimos al grupo en redis
        await self.channel_layer.group_add(
            self.room_group_name,  # Nombre del grupo al que nos uniremos
            self.channel_name, # "ID" unico que nos da redis para iniciar la conexion
        )

        #Aceptamos la conexión 
        print("CONECTED!")
        await self.accept()

    #------------------------------------------------------
    #     Función que maneja la desconexión del socket
    #------------------------------------------------------
    async def disconnect(self, close_code):
        #Nos salimos del grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    #---------------------------------------------------------------
    #   Función que maneja cuando un usuario envia msg via socket
    #---------------------------------------------------------------
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        plan_id = data["planid"]
        date = data["date"]
        user = self.scope["user"].username

        print("Message:", message)
        print("From: ", user)
        print("In this plan:", plan_id)
        print("At this date:", date)

        #Intentamos obtener los objetos de la base de datos (aun no hay handle de que pasa si es que no los pilla)
        userModel = await sync_to_async(CustomUser.objects.get)(username=user)
        planModel = await sync_to_async(PlanTrabajo.objects.get)(id=plan_id)
        
        #Guardamos el mensaje en la base de datos
        message_obj = await sync_to_async(Mensaje.objects.create)(
            plan=planModel,
            autor=userModel,
            text=message,
            timestamp=date
        )

        #Mandamos el mensaje al grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message", #con group_send django ejecuta la función definida en type, en este caso ejecutará chat_message
                "message": message,
                "user": user,
            }
        )



    #-------------------------------------------------------
    #     Función envía el msg que recibió al frontend
    #-------------------------------------------------------
    async def chat_message(self, event):
        # Enviar mensaje de vuelta al frontend
        await self.send(text_data=json.dumps({
            "user": event["user"],
            "message": event["message"]
        }))


