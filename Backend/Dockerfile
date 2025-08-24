# Imagen base
FROM python:3.11-slim

# Crear y usar directorio
WORKDIR /code

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .
