import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import MultiplayerRoom from '../../pages/MultiplayerRoom';
import io from 'socket.io-client';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import '../../localize/i18n';

//mock some socket behaviour
jest.mock('socket.io-client', () => {
  const emitMock = jest.fn();
  const mockPlayersData = ['exampleUser'];
  return () => ({
    on: (event, callback) => {
        if (event === 'update-players') {
          callback(mockPlayersData);
        }
      },
    emit: emitMock,
    disconnect: jest.fn(),
  });
});

describe('MultiplayerRoom component', () => {
  let socket;

  beforeEach(() => {
    socket = io();
  });

  afterEach(() => {
    //socket.disconnect();
  });

  test('creates a room', async () => {

    jest.mock('../../pages/MultiplayerRoom', () => ({
        ...jest.requireActual('../../pages/MultiplayerRoom'),
        generateRoomCode: jest.fn().mockReturnValue('AAAAA'),
    }));

    // Render the component
    const room =
    <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
            <MultiplayerRoom/>
        </Router>
    </SessionContext.Provider>
    
    render(room);

    // Click on Create Room button
    fireEvent.click(await screen.getByTestId("btn-create-room"));

    await waitFor(() => {
        expect(screen.getByText("Start game")).toBeInTheDocument();
    });

    //Sent to socket username and roomCode
    await waitFor(() => {
        expect(socket.emit).toHaveBeenCalledWith(
          'join-room',
          expect.any(String),
          'exampleUser',
          expect.any(String)  
        );
    });

    await waitFor(() => { //the user in the participant list
        expect(screen.getByText('exampleUser')).toBeInTheDocument();
    });

  });

  test('joins a room', async () => {
    const room =
    <SessionContext.Provider value={{ username: 'otherUser' }}>
        <Router>
            <MultiplayerRoom/>
        </Router>
    </SessionContext.Provider>
    
    render(room);

    //Write room code AAAAA
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'AAAAA' } });
   
    // Click on Create Room button
    fireEvent.click(await screen.getByTestId("btn-join-room"));

    await waitFor(() => {
        expect(screen.getByText("Start game")).toBeInTheDocument();
    });

    await waitFor(() => {
        expect(screen.getByText("AAAAA")).toBeInTheDocument();
    });

  });

});
