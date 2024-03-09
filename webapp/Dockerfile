FROM node:20

#Install MariaDB
RUN apt-get update && apt-get install -y mariadb-server

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

# Configura la base de datos MariaDB
RUN service mysql start && mysql -e "CREATE DATABASE IF NOT EXISTS base_de_datos_de_usuarios;"

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
