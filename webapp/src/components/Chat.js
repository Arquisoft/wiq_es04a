import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Typography, TextField, Grid, Container, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const socketEndpoint = process.env.REACT_APP_MULTIPLAYER_ENDPOINT || 'http://localhost:5010';

const ChatRoom = ({ roomCode, username }) => {
  const { t } = useTranslation();

  const isFirstRender = useRef(true);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(socketEndpoint);
    setSocket(newSocket);

    //join the room
    newSocket.emit('join-room-chat', roomCode, username);

    //make sure that only 1 time is executed
    if(isFirstRender.current) {
        isFirstRender.current = false;
       
        newSocket.on('recieved-message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
    }
    
  }, [roomCode, username]);

  useEffect(() => {
    console.log(messages)
  }, [messages])

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
        socket.emit('send-message', messageInput, roomCode, username);
        setMessageInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
  };

  return (
    <Container style={{ paddingTop: '20px', paddingBottom: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '10px' }}>
        {t("Multiplayer.Room.chat_title")}
      </Typography>
      <div style={{ height: '22em', maxHeight: '22em', overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="subtitle1" component="div">
              <strong>{message.username}: </strong>
              {message.message}
            </Typography>
          </div>
        ))}
      </div>
      <Grid container spacing={2} style={{ position: 'sticky', bottom: '20px' }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
            label={t("Multiplayer.Room.chat_input_label")}
            variant="outlined"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
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
            {t("Multiplayer.Room.send")}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};



export default ChatRoom;
