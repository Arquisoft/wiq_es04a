const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const e = require('express');

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

const apiEndpoint = process.env.GATEWAY_SERVICE_ENDPOINT || 'http://localhost:8000';

// Middlewares added to the application
app.use(cors());
app.use(express.json());

// Routes middlewares to be used
//app.use('/multiplayer', multiplayerRoutes);

const gameRooms = {};
const gameResults = {};

const getQuestion = () => {
    return axios.get(`${apiEndpoint}/questions`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error getting question from question service ', error);
      });
  };

// Handle new connections
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-room', (roomCode, username) => {
        socket.join(roomCode); 
        console.log(`${username} has joined game ${roomCode}`);
        
        if (gameRooms[roomCode] === undefined) {
            gameRooms[roomCode] = [username];
            gameResults[roomCode] = {};
            gameResults[roomCode][username] = {};
        } else if (!gameRooms[roomCode].includes(username)) {
            gameRooms[roomCode].push(username);
            gameResults[roomCode][username] = {};
        }
        
        const room = io.sockets.adapter.rooms.get(roomCode); // Obtain the room

        if(room && room.size === 2) {
            console.log("Game is ready");

            const questionList = [];

            io.to(roomCode).emit("game-ready", "ready");

            // tree questions -> this should be refactored in future
            Promise.all([getQuestion(), getQuestion(), getQuestion()])
            .then(questions => {
                questions.forEach(question => {
                questionList.push(question);
                });

                io.to(roomCode).emit("questions-ready", questionList, roomCode); // emit event only to room clients
            })

        }

        io.to(roomCode).emit("update-players", gameRooms[roomCode]);

        socket.on('finished-game', (username, correctAnswers, elapsedTime) => {
            // Store the correct answers and the player's time in the game room
            gameResults[roomCode][username] = { username, correctAnswers, elapsedTime };
            console.log(username, " has correctly answered ", correctAnswers, " questions in ", elapsedTime, "s")
            
            // Check if all players finished game
            const allPlayersFinished = Object.keys(gameResults[roomCode]).every(player => gameResults[roomCode][player].correctAnswers !== undefined);
            
            console.log(gameResults[roomCode])
            if(allPlayersFinished) 
                console.log("All players finished")

            if (allPlayersFinished) {
                let winner = null;
                let highestCorrectAnswers = -1;
                let lowestElapsedTime = Infinity;

                Object.keys(gameResults[roomCode]).forEach(player => {
                    const { username, correctAnswers, elapsedTime } = gameResults[roomCode][player];
                    
                    if (correctAnswers > highestCorrectAnswers ||
                        (correctAnswers === highestCorrectAnswers && elapsedTime < lowestElapsedTime)) {
                    winner = username;
                    highestCorrectAnswers = correctAnswers;
                    lowestElapsedTime = elapsedTime;
                    }
                });
                socket.emit("winner-player", winner);
            } else {
                socket.emit("waiting-players-end", "waiting");
            }

            });
      });
    
  });










// Start the service 
//TODO refactor names
const server2 = server.listen(port, () => {
  console.log(`Multiplayer Service listening at http://localhost:${port}`);
});

module.exports = server2