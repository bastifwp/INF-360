from channels.generic.websocket import AsyncWebsocketConsumer
#from asgiref.sync import async_to_sync
import json


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

        #Aceptamos la conección 
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
        print("AAAAAAAAAAAAAAAAAAAAAAAAAAAa")
        data = json.loads(text_data)
        message = data["message"]
        user = self.scope["user"].username

        print("Message:", message)
        print("From: ", user)

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


'''
class ChatConsumer(WebsocketConsumer):

    #websocket conecction
    def connect(self):
        user = self.scope['user'] 
        if not user.is_authenticated:
            return


        #Guardamos username para usarlo como nombre de grupo para este usuario
        self.username = user.username

        #Cuando nos aceptan queremos añadirnos a un gurpo tal que se haga broadcast a todos los demas del grupo
        #Cada vez que nos conectamos se nos da un "channel_name" unico. Queremos añadirlo al grupo llamado "self.username"
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )

        #Aceptamos conección web socket sólo si es que está autenticado
        self.accept()

    def disconnect(self, close_code):

        #Leave room/group
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )
    

    #-----------------------
    #   Handle requests
    #-----------------------


    def recieve(self, text_data):

        #Recive mensajes del websocket
        data = json.loads(text_data)
        data_source = data.get('source')

        print('receive', json.dumps(data, indent=2))

        #Message upload
        if data_source == 'message':
            self.recieve_message(data)


    def recieve_message(self, data):
        user = self.scope['user']
        #...

        #user.thumbnail.save(filename, image, save=True) -> en el vidoe hacian el ejemplo con imagenes no con mensajes asi que no se como se guarda en la base de datos

        #Send updated data to my group name with the source "message" and a serializer (creo q para mensajes esto último no es necesario)
        self.send_group(self.username, 'message', serialized.data)


    #---------------------------------------------
    #   Catch/all boradcast to client helpers
    #---------------------------------------------
    def send_group(self, group, source, data):
        response = {
            'type': 'broadcast_group',
            'source': source,
            'data': data,
        }

        async_to_sync(self.channel_layer.group_send)(
            group, response #Los del grupo llaman a otra función según 'type', en este caso llamarán a una función broadcast_group
        )

    #Esta función será llamada por los consumers que esten attached al group
    def broadcast_group(self, data):
        
        #data :
        #    -type: 'broadcast_group'
        #    -source: Desde donde se originó la data
        #    -data: lo que se manda como diccionario
        

        #Send data along the websocket
        data.pop('type') #no queremos mandar el type
        self.send(text_data=json.dumps(data))
    '''

