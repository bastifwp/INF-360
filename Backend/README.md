# BackEnd Django + PostgreSQL con Docker

## Levantar el entorno

1. Asegúrate de tener Docker y Docker Compose instalados y corriendo.
2. Clona este repositorio.
3. Agregar archivo .env a ruta base.
4. Levanta los servicios con:

```bash
docker compose up -d --build
```

Esto levantará:

- `web`: contenedor con la app Django, accesible en http://localhost:8000
- `db`: contenedor con PostgreSQL, escuchando en el puerto interno 5432

## Agregar nuevas tablas (modelos)

Para definir y aplicar un nuevo modelo (tabla en la base de datos):

1. Abrir `ceapp/models.py` y definir el modelo, hay un ejemplo.

2. Ejecuta los siguientes comandos para generar y aplicar las migraciones:

```bash
docker compose exec web python manage.py makemigrations ceapp
docker compose exec web python manage.py migrate
```

Y listo, la nueva tabla estará en la base de datos PostgreSQL.

## Agregar nuevos endpoints

1. Ir a `ceapp/views.py` y definir una función o clase para el endpoint para crear la vista
2. En a `ceapp/urls.py` importar la vista nueva para agregar un path con la ruta y la vista

### Extra (falta comprobar)
Se puede registrar un modelo para poder vizualisarlo desde el navegador con el admin de django y tambien permite hacer operaciones CRUD. Para esto es necesario en `/ceapp/admin.py` importar el modelo y luego registrarlo con `admin.site.register(modelo)`