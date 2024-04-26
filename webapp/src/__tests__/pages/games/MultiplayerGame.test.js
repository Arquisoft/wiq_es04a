import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../../SessionContext'; 
import { BrowserRouter, useLocation } from 'react-router-dom'; 
import MultiplayerGame from '../../../pages/games/MultiplayerGame';
import io from 'socket.io-client';
import '../../../localize/i18n';

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
    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));

    expect(screen.getByTestId('question'));
    expect(screen.findByText('Madrid'));
    expect(screen.findByText('Barcelona'));
    expect(screen.findByText('Paris'));
    expect(screen.findByText('London'));
  });

  it('should guess correct answer', async () => {
    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'rgb(0, 102, 153);' });

    //selects correct answer
    fireEvent.click(correctAnswer);

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'rgb(51, 153, 102);' });
  });

  
  it('should choose incorrect answer', async () => {
    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });

    expect(incorrectAnswer).toHaveStyle({ backgroundColor: 'rgb(0, 102, 153);' });

    //selects correct answer
    fireEvent.click(incorrectAnswer); 

    expect(incorrectAnswer).toHaveStyle({ backgroundColor: 'rgb(153, 0, 0);' });
  });

  it('should render progress bar', async () => {
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const progressBar = screen.getByTestId('prog_bar0');
    await expect(progressBar).toBeInTheDocument();
  })

});
