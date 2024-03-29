import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Paper } from '@mui/material';
import io from 'socket.io-client';

//TODO add this to docker yml
const socketEndpoint = process.env.MULTIPLAYER_ENDPOINT || 'http://localhost:5010';

const socket = io(socketEndpoint);

const MultiplayerRoom = () => {
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
  
    const handleCreateRoom = () => {
      socket.emit('createRoom', (roomCode) => {
        setRoomCode(roomCode);
      });
    };
  
    const handleJoinRoom = () => {
      socket.emit('joinRoom', roomCode, (error) => {
        if (error) {
          setError(error);
        }
      });
    };
  
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
              Sala de Chat
            </Typography>
            <Button variant="contained" onClick={handleCreateRoom}>
              Crear Sala
            </Button>
            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
              o
            </Typography>
            <TextField
              label="Código de Sala"
              variant="outlined"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              fullWidth
              style={{ marginTop: '10px' }}
            />
            <Button variant="contained" onClick={handleJoinRoom} style={{ marginTop: '10px' }}>
              Unirse a Sala
            </Button>
            {error && (
              <Typography variant="subtitle1" gutterBottom style={{ marginTop: '10px', color: 'red' }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
  
export default MultiplayerRoom;