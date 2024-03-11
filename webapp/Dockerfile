FROM node:20

WORKDIR /app

# Copiar solo el archivo package.json
COPY package.json .

# Install dependencies
RUN npm install

# Copiar el resto del código
COPY . .

# Build the app
RUN npm run build

# Instalar serve
RUN npm install serve

#CMD ["serve", "-s", "build"]

