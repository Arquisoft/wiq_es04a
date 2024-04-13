import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import io from 'socket.io-client';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import '../../localize/i18n';
import Chat from '../../components/Chat';

const sentMsg = "hola!";

//mock some socket behaviour
jest.mock('socket.io-client', () => {
    const emitMock = jest.fn();
    const mockMsgs = [sentMsg];
    return () => ({
      on: (event, callback) => {
        if (event === 'recieved-message') {
          callback(mockMsgs);
        }
      },
      emit: emitMock,
      disconnect: jest.fn(),
    });
});

describe('Chat component', () => {
    let socket;
  
    beforeEach(() => {
      socket = io();
    });
  
  
    test('sends a message', async () => {
  
      jest.mock('../../pages/MultiplayerRoom', () => ({
          ...jest.requireActual('../../pages/MultiplayerRoom'),
          generateRoomCode: jest.fn().mockReturnValue('AAAAA'),
      }));
  
      // Render the component
      const chat =
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
              <Chat roomCode="AAAA1" username="exampleUser"/>
          </Router>
      </SessionContext.Provider>
      
      render(chat);

      const inputElement = screen.getByLabelText('Type your message'); 
      const sendButton = screen.getByText('Send');
  
      //write msg
      fireEvent.change(inputElement, { target: { value: sentMsg } });
    
      //send msg
      fireEvent.click(sendButton);
  
      //Sent to socket username and message
      await waitFor(() => {
          expect(socket.emit).toHaveBeenCalledWith(
            'send-message',
            sentMsg,
            "AAAA1",
            'exampleUser', 
          );
      });
  
    });
  
  });