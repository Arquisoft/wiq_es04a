const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

// Routes: TODO maybe dont needed
//const multiplayerRoutes = require('./routes/question-routes.js');

// App definition
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 5010;

// Middlewares added to the application
app.use(cors());
app.use(express.json());

// Routes middlewares to be used
//app.use('/multiplayer', multiplayerRoutes);

// handle new connections
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
  
    
  });










// Start the service 
//TODO refactor names
const server2 = server.listen(port, () => {
  console.log(`Multiplayer Service listening at http://localhost:${port}`);
});

module.exports = server2