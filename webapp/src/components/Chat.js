import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Typography, TextField, Grid, Container, Button, List, ListItem } from '@mui/material';
import { styled } from '@mui/system';
import { Paper } from '@mui/material';

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
    <Container style={{ paddingTop: '20px', paddingBottom: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" gutterBottom>
        Chat Room
      </Typography>
      <Grid container spacing={2}>
        {messages.map((message, index) => (
          <Grid item xs={12} key={index} style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="subtitle1" component="div">
              <strong>{message.username}: </strong>
              {message.message}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
            label="Type your message"
            variant="outlined"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            style={{ marginLeft: '8px', borderRadius: '5px' }}
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
