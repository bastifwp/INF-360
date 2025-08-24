from django.urls import path, re_path #Permite utilizar expresiones regulares

from . import consumers #Consumers son las views para las routes


websocket_urlpatterns = [
    path("ws/chat/<int:plan_id>/", consumers.ChatConsumer.as_asgi()),#web socket para conectarse a un plan en especifico
    #path('chat/', consumers.ChatConsumer.as_asgi())

]
