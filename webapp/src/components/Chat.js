import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const socketEndpoint = process.env.REACT_APP_MULTIPLAYER_ENDPOINT || 'http://localhost:5010';
const socket = io(socketEndpoint);

const ChatRoom = ({ roomCode, username }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    //join the room
    socket.emit('join-room', roomCode, username);

    //manage input messages
    socket.on('recieved-message', (message) => {
      setMessages([...messages, message]);
    });

  }, [roomCode, messages, username]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
        socket.emit('send-message', messageInput, roomCode, username);
        setMessageInput('');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chat Room
      </Typography>
      <Grid container spacing={2}>
        {messages.map((message, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="subtitle1" component="div">
              <strong>{message.username}: </strong>
              {message.message}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="Type your message"
            variant="outlined"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={sendMessage}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatRoom;
