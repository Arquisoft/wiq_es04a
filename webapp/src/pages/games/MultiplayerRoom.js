import React, { useState, useEffect  } from 'react';
import { useTheme, Button, TextField, Typography, Paper, List, ListItem, CircularProgress, Container, Box } from '@mui/material';
import io from 'socket.io-client';
import { useContext } from 'react';
import { SessionContext } from '../../SessionContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Chat from '../../components/Chat';

const socketEndpoint = process.env.REACT_APP_MULTIPLAYER_ENDPOINT || 'http://localhost:5010';

const MultiplayerRoom = () => {
    const { t } = useTranslation();
    const theme = useTheme();

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
      <Box sx={{display: 'flex', flexDirection: { xs: "column", lg: 'row' }, justifyContent: 'center', flex: 1, alignItems: 'center', padding: '2em 0', gap: '4em' }}>
        {roomCode && error === "" && (
          <Container></Container>
        )}
        <Paper elevation={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2em', padding: '3em', borderRadius: '4em' }}>
          <Typography variant="h2" align="center" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>
            {t("Games.Multiplayer.name").toUpperCase()}
          </Typography>

          {roomCode && error === "" ? (
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }} >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , gap: '1em',
                          border: `2px solid ${theme.palette.primary.main}`, borderRadius: '1em', padding: '1em' }}>
                <Typography variant="h4">
                  { t("Multiplayer.Room.code") }:
                </Typography>
                <Typography variant="h5" >
                  {roomCode}
                </Typography>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', 
                        border: `2px solid ${theme.palette.success.main}`, borderRadius: '1em', padding: '1em' }}>
                <Typography variant="h4">
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
              </Box>
            </Container>
          ) : (
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }} >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , gap: '1em',
                          border: `2px solid ${theme.palette.primary.main}`, borderRadius: '1em', padding: '1em' }}>
                <Typography variant="h4">
                  { t("Multiplayer.Room.join") }
                </Typography>
                <TextField
                  label="Room code"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setWrittenCode(e.target.value)}                  
                />
                <Button variant="contained" onClick={handleJoinRoom} data-testid="btn-join-room"
                        size='large'
                        sx={{
                            fontFamily: 'Arial Black, sans-serif',
                            color: theme.palette.primary.main,
                            backgroundColor: 'transparent',
                            border: `2px solid ${theme.palette.primary.main}`,
                            transition: 'background-color 0.3s ease',
    
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                            }
                        }}>
                  { t("Multiplayer.Room.join") }
                </Button>
                {error && (
                  <Typography variant="subtitle1" gutterBottom color="error">
                    {error}
                  </Typography>
                )}
              </Box>

              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', 
                        border: `2px solid ${theme.palette.success.main}`, borderRadius: '1em', padding: '1em' }}>
                <Typography variant="h6">
                  { t("Multiplayer.Room.new_game") }
                </Typography>
                <Button variant="contained" onClick={handleCreateRoom} data-testid="btn-create-room"
                        size='large'
                        sx={{
                            fontFamily: 'Arial Black, sans-serif',
                            color: theme.palette.success.main,
                            backgroundColor: 'transparent',
                            border: `2px solid ${theme.palette.success.main}`,
                            transition: 'background-color 0.3s ease',
    
                            '&:hover': {
                                backgroundColor: theme.palette.success.main,
                                color: 'white',
                            }
                        }}>
                  { t("Multiplayer.Room.create") }
                </Button>
              </Box>
            </Container>
          )}
        </Paper>

        {roomCode && error === "" && (
          <Container >
            <Chat roomCode={roomCode} username={username} />
          </Container>
        )}
      </Box>
      );
  }

export default MultiplayerRoom;