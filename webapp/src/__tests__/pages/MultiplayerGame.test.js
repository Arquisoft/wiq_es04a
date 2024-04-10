import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; 
import { BrowserRouter, useLocation } from 'react-router-dom'; 
import MultiplayerGame from '../../pages/MultiplayerGame';
import io from 'socket.io-client';
import '../../localize/i18n';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn()
}));

jest.mock('socket.io-client', () => {
    const emitMock = jest.fn();
    return () => ({
      on: jest.fn(),
      emit: emitMock,
      disconnect: jest.fn(),
    });
});

describe('Game component', () => {
    let socket;
    
    beforeEach(() => {
        socket = io();
    });

    const questionObject = {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Geography'],
        language: 'en'
    };

    const generateQuestionArray = (questionObject, count) => {
        const questionArray = [];
        for (let i = 0; i < count; i++) {
            questionArray.push(questionObject);
        }
        return questionArray;
    };

    const mockgameQuestions = generateQuestionArray(questionObject, 3);

  it('should render with recieved room code and questions ', async () => {
      
    //mock info that room sent to the game
      useLocation.mockReturnValue({
        state: {
          gameQuestions: mockgameQuestions,
          roomCode: "AAAAA",
        },
      })

      render(
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <BrowserRouter>
            <MultiplayerGame />
        </BrowserRouter>
      </SessionContext.Provider>
      );

    expect(screen.findByText('1'));
    expect(screen.findByText('1/3'));

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('Which is the capital of Spain?'));
    expect(screen.findByText('Madrid'));
    expect(screen.findByText('Barcelona'));
    expect(screen.findByText('Paris'));
    expect(screen.findByText('London'));
  });

 it('should guess correct answer', async () => {

    useLocation.mockReturnValue({
        state: {
          gameQuestions: mockgameQuestions,
          roomCode: "AAAAA",
        },
      })

      render(
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <BrowserRouter>
            <MultiplayerGame />
        </BrowserRouter>
      </SessionContext.Provider>
      );

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(correctAnswer).not.toHaveStyle({ backgroundColor: 'green' });

    //selects correct answer
    fireEvent.click(correctAnswer);

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'green' });

  });

  
  it('should choose incorrect answer', async () => {

    useLocation.mockReturnValue({
        state: {
          gameQuestions: mockgameQuestions,
          roomCode: "AAAAA",
        },
      })

      render(
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <BrowserRouter>
            <MultiplayerGame />
        </BrowserRouter>
      </SessionContext.Provider>
      );

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });

    expect(incorrectAnswer).not.toHaveStyle({ backgroundColor: 'red' });

    //selects correct answer
    fireEvent.click(incorrectAnswer); 

    expect(incorrectAnswer).toHaveStyle({ backgroundColor: 'red' });

  });

});
