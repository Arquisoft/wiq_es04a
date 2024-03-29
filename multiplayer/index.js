const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

// Routes: TODO maybe dont needed
//const multiplayerRoutes = require('./routes/question-routes.js');

// App definition
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: { //permit connections from webapp
        origin: process.env.WEBAPP_ENDPOINT || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = 5010;

// Middlewares added to the application
app.use(cors());
app.use(express.json());

// Routes middlewares to be used
//app.use('/multiplayer', multiplayerRoutes);

// Handle new connections
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join-room', (roomCode) => {
        socket.join(roomCode); 
        console.log(`Client has joined game ${roomCode}`);
        
        const room = io.sockets.adapter.rooms.get(roomCode); // Obtener the room

        if(room && room.size === 2) {
            console.log("Game is ready");
            io.to(roomCode).emit("game-ready", "ready"); // emit event only to room clients
        }
      });
    
  });










// Start the service 
//TODO refactor names
const server2 = server.listen(port, () => {
  console.log(`Multiplayer Service listening at http://localhost:${port}`);
});

module.exports = server2