#FROM node:20

#COPY . /app
#WORKDIR /app

#Install the dependencies
#RUN npm install

#ARG API_URI="http://localhost:8000"
#ARG API_URI="http://gatewayservice:8000"
#ENV REACT_APP_API_ENDPOINT=$API_URI

#Create an optimized version of the webapp
#RUN npm run build
#RUN npm install serve

# Copy the app source code to the working directory
#COPY . .

#Execute npm run prod to run the server
#CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]

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

