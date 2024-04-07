# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/multiplayer

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

ARG API_URI="http://localhost:5010"
ENV MULTIPLAYER_ENDPOINT=$API_URI

# Copy the app source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5010

# Define the command to run your app
CMD ["node", "index.js"]
