import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; // Importa el contexto necesario
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
//import { MemoryRouter, useLocation } from 'react-router-dom';

//import { BrowserRouter } from 'react-router-dom'; 
const mockAxios = new MockAdapter(axios);
import { BrowserRouter, useLocation } from 'react-router-dom'; 
import MultiplayerGame from '../../pages/MultiplayerGame';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn()
}));



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

    const mockgameQuestions = generateQuestionArray(questionObject, 3);
// state: { gameQuestions: mockgameQuestions, roomCode: mockroomCode}
   /* jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useLocation: jest.fn(() => ({
          state: { gameQuestions: mockgameQuestions, roomCode: mockroomCode}
        })),
    }));*/

   

  //  const Router = require('react-router-dom');

  it('should render recieved room code, question, answers and other ', async () => {

   /*render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router.MemoryRouter initialEntries = {['/multiplayerGame'] }>
        <Router.Routes>
          <Router.Route path="/multiplayerGame" element={<MultiplayerGame />}/>
        </Router.Routes>
      </Router.MemoryRouter>
      </SessionContext.Provider>
    );*/

   /* render(
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
            <Router.BrowserRouter>
                <MultiplayerGame />
            </Router.BrowserRouter>
        </SessionContext.Provider>
    )*/

   /* render(
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router.MemoryRouter initialEntries={['/multiplayerGame']}>
            <MultiplayerGame />
          </Router.MemoryRouter>
        </SessionContext.Provider>
      );*/
      
      useLocation.mockReturnValue({
        state: {
          gameQuestions: mockgameQuestions,
          roomCode: roomCode,
        },
      })

      render(
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <BrowserRouter>
            <MultiplayerGame />
        </BrowserRouter>
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
