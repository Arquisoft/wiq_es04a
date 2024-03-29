import React, { useState, useEffect  } from 'react';
import { Button, TextField, Typography, Grid, Paper } from '@mui/material';
import io from 'socket.io-client';

//TODO add this to docker yml
const socketEndpoint = process.env.MULTIPLAYER_ENDPOINT || 'ws://localhost:5010';

const MultiplayerRoom = () => {
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);

    const handleCreateRoom = () => {
      generateRoomCode();
      
      
    };

    useEffect(() => {
        const newSocket = io(socketEndpoint);
        setSocket(newSocket);

        newSocket.on('hello', (arg) => {
            console.log("hello" + arg)
            
          });

        newSocket.on('connection', () => {
            console.log("Trying to connect")
            
          });

        // clean at component dismount
        return () => {
        newSocket.disconnect();
        };
    }, []);
  
    const handleJoinRoom = () => {
      socket.emit('joinRoom', roomCode, (error) => {
        if (error) {
          setError(error);
        }
      });
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