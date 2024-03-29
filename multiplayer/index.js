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
    cors: {
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
    socket.emit("hello", "world");
    socket.on('join-game', (roomID) => {
        socket.join(roomID); 
        console.log(`El cliente se ha unido a la partida ${roomID}`);
      
      });
    
  });










// Start the service 
//TODO refactor names
const server2 = server.listen(port, () => {
  console.log(`Multiplayer Service listening at http://localhost:${port}`);
});

module.exports = server2