# Dockerfile para el backend
FROM node:18

WORKDIR /usr/src/app

# Copiar archivos de configuración de paquetes
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del backend
COPY . .

# Puerto expuesto (debe coincidir con tu configuración en .env)
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]