import React, { useState, useEffect  } from 'react';
import { Button, TextField, Typography, Grid, Paper, List, ListItem, CircularProgress } from '@mui/material';
import io from 'socket.io-client';
import { useContext } from 'react';
import { SessionContext } from '../SessionContext';

import { Link, useHistory } from 'react-router-dom';
//TODO add this to docker yml
const socketEndpoint = process.env.MULTIPLAYER_ENDPOINT || 'ws://localhost:5010';

const MultiplayerRoom = () => {
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);
    const [writtenCode, setWrittenCode] = useState('');
    const [roomPlayers, setRoomPlayers] = useState([]);
    const {username} = useContext(SessionContext);
    const [gameReady, setGameReady] = useState(false);
    const [roomCreator, setRoomCreator] = useState(false);
    const [gameQuestions, setGameQuestions] = useState(null);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const history = useHistory();
    useEffect(() => {
        const newSocket = io(socketEndpoint);
        setSocket(newSocket);

        newSocket.on('game-ready', () => {
            setGameReady(true);
        });

        newSocket.on('update-players', (roomPlayers) => {
            setRoomPlayers(roomPlayers);
        });

        newSocket.on('questions-ready', (questions) => {
            setGameQuestions(questions);
            setLoadingQuestions(false);
           
        });

        // clean at component dismount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleCreateRoom = () => {
        const code = generateRoomCode();
        setRoomCreator(true);
  
        socket.on('connection', () => {
          
        });
       
        socket.emit('join-room', code, username);
  
      };
  
    const handleJoinRoom = () => {
      setRoomCreator(false);
      setRoomCode(writtenCode);
      socket.emit('join-room', writtenCode, username);
    };

    const generateRoomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 5;

        let code = '';
        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }
        setRoomCode(code);

        return code;
    }

    const startGame = () => {
        setLoadingQuestions(true);
        const button = document.getElementById('playBtn');
        setGameReady(false);
    }
  
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              {roomCode ? (
                <>
                  <Typography variant="h4" gutterBottom>
                    Room Code:
                  </Typography>
                  <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
                    {roomCode}
                  </Typography>

                  <Typography variant="h4" gutterBottom>
                    Participants:
                  </Typography>
                  <List>
                    {roomPlayers.map((player, index) => (
                    <ListItem key={index}>
                        <Typography variant='h5'>{player}</Typography>
                    </ListItem>
                    ))}
                  </List>
                  <Button id="playBtn" variant="contained" disabled={!gameReady || !roomCreator} onClick={startGame} style={{ marginTop: '10px' }}>
                    Start game
                  </Button>
                  {loadingQuestions && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <CircularProgress />
                    </div>
                )}
                </>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    Create room
                  </Typography>
                  <Button variant="contained" onClick={handleCreateRoom}>
                    Create room
                  </Button>
                  <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    Join room
                  </Typography>
                  <TextField
                    label="Room code"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setWrittenCode(e.target.value)}
                    style={{ marginTop: '10px' }}
                  />
                  <Button variant="contained" onClick={handleJoinRoom} style={{ marginTop: '10px' }}>
                    Join room
                  </Button>
                  {error && (
                    <Typography variant="subtitle1" gutterBottom style={{ marginTop: '10px', color: 'red' }}>
                      {error}
                    </Typography>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      );
  }

export default MultiplayerRoom;