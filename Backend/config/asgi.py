"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

#Default imports
import ceapp.routing
import os
from django.core.asgi import get_asgi_application

# ADDED FOR CHAT
#import chat.routing
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack





os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket' : AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack( #Esto permite hacer validación JWT
            URLRouter(ceapp.routing.websocket_urlpatterns)
        )
    )
})

