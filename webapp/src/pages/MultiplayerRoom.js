import React, { useState, useEffect  } from 'react';
import { Button, TextField, Typography, Grid, Paper, List, ListItem, CircularProgress } from '@mui/material';
import io from 'socket.io-client';
import { useContext } from 'react';
import { SessionContext } from '../SessionContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Chat from '../components/Chat';

const socketEndpoint = process.env.REACT_APP_MULTIPLAYER_ENDPOINT || 'http://localhost:5010';

const MultiplayerRoom = () => {
    const { t } = useTranslation();

    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [socket, setSocket] = useState(null);
    const [writtenCode, setWrittenCode] = useState("");
    const [roomPlayers, setRoomPlayers] = useState([]);
    const {username} = useContext(SessionContext);
    const [gameReady, setGameReady] = useState(false);
    const [roomCreator, setRoomCreator] = useState(false);
    const [gameQuestions, setGameQuestions] = useState(null);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const navigate = useNavigate();
    const [gameLoaded, setGameLoaded] = useState(false);
  
    useEffect(() => {
        const newSocket = io(socketEndpoint);
        setSocket(newSocket);

        newSocket.on('game-ready', (msg) => {
            if(msg === "ready") {
              setGameReady(true);
              setLoadingQuestions(true);
            } else {
              setGameReady(false);
            }
            
        });

        newSocket.on('update-players', (roomPlayers) => {
            setRoomPlayers(roomPlayers);
        });

        newSocket.on('questions-ready', (questions, roomCode) => {
            setGameQuestions(questions);
            setLoadingQuestions(false);
            setGameLoaded(true);
        });

        newSocket.on('join-error', errorMessage => {
            setError(errorMessage);
        });

        // clean at component dismount
        return () => {
            newSocket.disconnect();
        };
    }, [navigate]);

    useEffect(() => {
      if(socket !== null) {
        socket.on('btn-start-pressed', () => {
          navigate('/multiplayerGame', { state: {gameQuestions, roomCode} });
        });
      }
    }, [socket, navigate, gameQuestions, roomCode])

    const handleCreateRoom = () => {
        setError("");
        const code = generateRoomCode();
        setRoomCreator(true);
        
        socket.on('connection', () => {
          
        });
       
        socket.emit('join-room', code, username, "create");
      };
  
    const handleJoinRoom = () => {
        socket.emit('join-room', writtenCode, username, "join");
        setRoomCreator(false);
        setRoomCode(writtenCode);
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
        setGameReady(false);
        socket.emit("started-game", true);
    }
  
    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Grid item xs={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              {roomCode && error === "" ? (
                <>
                  <Typography variant="h4" gutterBottom>
                    { t("Multiplayer.Room.code") }:
                  </Typography>
                  <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
                    {roomCode}
                  </Typography>

                  <Typography variant="h4" gutterBottom>
                    { t("Multiplayer.Room.participants") }:
                  </Typography>
                  <List>
                    {roomPlayers.map((player, index) => (
                    <ListItem key={index}>
                        <Typography variant='h5'>{player}</Typography>
                    </ListItem>
                    ))}
                  </List>
                  <Button id="playBtn" variant="contained" disabled={!gameReady || !roomCreator || !gameLoaded} onClick={startGame} style={{ marginTop: '10px' }}>
                    { t("Multiplayer.Room.start") }
                  </Button>
                  {loadingQuestions && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', flexDirection: "column", alignItems: "center" }}>
                        <CircularProgress />
                        <Typography variant='h5' style={{ marginTop: '1em'}}>Loading questions...</Typography>
                    </div>
                )}
                </>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    { t("Multiplayer.Room.create") }
                  </Typography>
                  <Button variant="contained" onClick={handleCreateRoom} data-testid="btn-create-room">
                    { t("Multiplayer.Room.create") }
                  </Button>
                  <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                    { t("Multiplayer.Room.join") }
                  </Typography>
                  <TextField
                    label="Room code"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setWrittenCode(e.target.value)}
                    style={{ marginTop: '10px' }}
                  />
                  <Button variant="contained" onClick={handleJoinRoom} style={{ marginTop: '10px' }} data-testid="btn-join-room">
                    { t("Multiplayer.Room.join") }
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
          {roomCode && error === "" && (
            <Grid item xs={3} sx={{marginLeft: '2em'}}>
              
              <Chat roomCode={roomCode} username={username} />
            </Grid>
          )}
        </Grid>
      );
  }

export default MultiplayerRoom;