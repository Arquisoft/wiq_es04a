FROM node:20

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:8000"
ARG ONLINE_URI="http://localhost:5010"
ENV REACT_APP_API_ENDPOINT=$API_URI
ENV MULTIPLAYER_ENDPOINT=$ONLINE_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
