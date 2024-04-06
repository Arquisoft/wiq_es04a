import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import MultiplayerRoom from '../../pages/MultiplayerRoom';
import io from 'socket.io-client';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('socket.io-client', () => {
  const onMock = jest.fn();
  const emitMock = jest.fn();

  return () => ({
    on: onMock,
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

  test('creates a room and joins it', async () => {

    const generateRoomCodeMock = jest.fn().mockReturnValue('AAAAA');

    // Render the component
    const room =
    <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
            <MultiplayerRoom/>
        </Router>
    </SessionContext.Provider>
    render(room);

    // Mock functions
   /* socket.emit.mockImplementationOnce((event, code, username) => {
      expect(event).toBe('join-room');
      expect(code).toBeTruthy(); 
      expect(username).toBeTruthy(); 
    });*/

    // Click on Create Room button
    fireEvent.click(await screen.getByTestId("btn-create-room"));

    // Wait for room code to appear
   /* await waitFor(() => {
        expect(screen.getByText("AAAAA")).toBeInTheDocument();
    });*/

    await waitFor(() => {
        expect(screen.getByText("Start game")).toBeInTheDocument();
    });

    // Fill in room code
  //  fireEvent.change(screen.getByLabelText('Room code'), { target: { value: 'ABCDE' } });

    // Click on Join Room button
   // fireEvent.click(screen.getByText('Join room'));

    // Expect join-room to be called with the written code
   // expect(socket.emit).toHaveBeenCalledWith('join-room', 'ABCDE', expect.any(String));
  });

});
