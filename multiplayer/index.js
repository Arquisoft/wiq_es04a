const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

// App definition
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: { //permit connections from webapp
        //origin: [process.env.WEBAPP_ENDPOINT, "http://localhost:3000"],
        origin: "*", //this should be changed to improve security
        methods: ["GET", "POST"],
        allowedHeaders: "*" //this should be changed to improve security
    }
});

const port = 5010;

const apiEndpoint = process.env.GATEWAY_SERVICE_ENDPOINT || 'http://localhost:8000';

// Middlewares added to the application
app.use(express.json());
app.use(cors()); 

const gameRooms = {};
const gameResults = {};

const getQuestion = () => { //TODO 
    return axios.get(`${apiEndpoint}/questions/en`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error getting question from question service ', error);
      });
  };

  function getAndEmitQuestions(roomCode) {
    const questionList = [];
    const getQuestionSequentially = async () => {
        for (let i = 0; i < 3; i++) {
            const question = await getQuestion();
            questionList.push(question);
        }
        io.to(roomCode).emit("questions-ready", questionList, roomCode);
    };

    getQuestionSequentially().catch(error => {
        console.error("Error obtaining question list:", error);
    });
}

// Handle new connections
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-room', (roomCode, username, action) => {

        if(action === 'join') {
            console.log("JOIN")
            if (!gameRooms[roomCode]) {
                console.log("JOIN IF")
                socket.emit('join-error', 'Room does not exist');
                return;
            } else {
                socket.emit('join-error', '');
            }
        }
       
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

        if(room && room.size >= 2) {
            console.log("Game is ready");

            io.to(roomCode).emit("game-ready", "ready");

            getAndEmitQuestions(roomCode);
        }

        io.to(roomCode).emit("update-players", gameRooms[roomCode]);

        socket.on('started-game', () => {
            io.to(roomCode).emit("btn-start-pressed");
        })

        socket.on('finished-game', (username, correctAnswers, elapsedTime) => {
            // Store the correct answers and the player's time in the game room
            gameResults[roomCode][username] = { username, correctAnswers, elapsedTime };
            console.log(username, " has correctly answered ", correctAnswers, " questions in ", elapsedTime, "s")
            
            // Check if all players finished game
            const allPlayersFinished = Object.keys(gameResults[roomCode]).every(player => gameResults[roomCode][player].correctAnswers !== undefined);
            
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
                io.to(roomCode).emit("winner-player", winner, highestCorrectAnswers, lowestElapsedTime);
            } else {
                io.to(roomCode).emit("waiting-players-end", "waiting");
            }

            });

            socket.on('disconnect', () => {
                console.log(`${username} has disconnected`);
                
                const index = gameRooms[roomCode].indexOf(username);
                if (index !== -1) {
                    gameRooms[roomCode].splice(index, 1);
                    delete gameResults[roomCode][username];
                    io.to(roomCode).emit("update-players", gameRooms[roomCode]);
                    
                    const room = io.sockets.adapter.rooms.get(roomCode);
                    if(room && room.size < 2) {
                        io.to(roomCode).emit("game-ready", "not-ready");
                    }
                    
                }
            });
      });

      socket.on('join-room-chat', (roomCode, username) => {
        socket.join(roomCode + "-chat");

        socket.removeAllListeners('send-message');

        socket.on('send-message', (message, roomCode, username) => {
            io.to(roomCode + "-chat").emit('recieved-message', { username, message });
        });
    
    
    });
    
  });



// Start the service 
server.listen(port, () => {
  console.log(`Multiplayer Service listening at port ${port}`);
});