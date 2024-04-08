FROM node:20

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:8000"
ARG REACT_APP_MULTIPLAYER_ENDPOINT
ENV REACT_APP_MULTIPLAYER_ENDPOINT=$REACT_APP_MULTIPLAYER_ENDPOINT
ENV REACT_APP_API_ENDPOINT=$API_URI

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]
