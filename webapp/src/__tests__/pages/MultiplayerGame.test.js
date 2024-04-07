import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; // Importa el contexto necesario

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, useLocation } from 'react-router-dom';
import MultiplayerGame from '../../pages/MultiplayerGame';
import MultiplayerRoom from '../../pages/MultiplayerRoom';
import { shallow } from 'enzyme';

const mockAxios = new MockAdapter(axios);

describe('Game component', () => {

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

    const roomCode = 'ABC123';
    const gameQuestions = generateQuestionArray(questionObject, 3);

    const mockLocationState = {
        gameQuestions: gameQuestions,
        roomCode: 'ABC123'
    };

    jest.mock('react-router-dom', () => {
        return {
          ...jest.requireActual('react-router-dom'),
          useLocation: jest.fn(() => (mockLocationState)),
        };
      });

    const Router = require('react-router-dom');

  it('should render recieved room code, question, answers and other ', async () => {

   render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
            <MultiplayerGame />
        </Router>
      </SessionContext.Provider>
    );

    expect(screen.getByRole('progressbar'));
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

 /* it('should guess correct answer', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
            <MultiplayerGame />,
            {{ state: { gameQuestions, roomCode } }}
        </Router>
      </SessionContext.Provider>
    );

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(correctAnswer).not.toHaveStyle({ backgroundColor: 'green' });

    //selects correct answer
    fireEvent.click(correctAnswer);

    //expect(screen.findByText('1')).toHaveStyle({ backgroundColor: 'lightgreen' });

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'green' });

  });

  
  it('should choose incorrect answer', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
            <MultiplayerGame />,
            {{ state: { gameQuestions, roomCode } }}
        </Router>
      </SessionContext.Provider>
    );
    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });

    expect(incorrectAnswer).not.toHaveStyle({ backgroundColor: 'red' });

    //selects correct answer
    fireEvent.click(incorrectAnswer);

    expect(incorrectAnswer).toHaveStyle({ backgroundColor: 'red' });

  });*/

});
