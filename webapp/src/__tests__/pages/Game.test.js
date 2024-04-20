import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; // Importa el contexto necesario
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from '../../pages/Game';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onGet('http://localhost:8000/questions').reply(200, 
        {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Geography'],
        language: 'en'
        }
    );

    mockAxios.onPost('http://localhost:8000/statistics').reply(200, { success: true });
    mockAxios.onPost('http://localhost:8000/user/questionsRecord').reply(200, { success: true });

    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
        </Router>
      </SessionContext.Provider>
    );
  });

  it('should render question, answers and other ', async () => {
    expect(screen.getByRole('progressbar'));
    expect(screen.findByText('1'));
    //expect(screen.findByText('1/3'));

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));

    expect(screen.findByText('Which is the capital of Spain?'.toUpperCase()));
    expect(screen.findByText('Madrid'));
    expect(screen.findByText('Barcelona'));
    expect(screen.findByText('Paris'));
    expect(screen.findByText('London'));

  });

  it('should guess correct answer', async () => {
    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(screen.findByTestId("anwer0"));
    //selects correct answer
    fireEvent.click(correctAnswer);
    expect(screen.findByTestId("succes0"));
  });

  
  it('should choose incorrect answer', async () => {
    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });

    expect(screen.findByTestId("anwer1"));
    //selects correct answer
    fireEvent.click(incorrectAnswer);
    expect(screen.findByTestId("failure1"));
  });

  it('should not answer the question', async () => {
    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

  it('should render pause & play buttons when answered', async () => {
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });
    fireEvent.click(correctAnswer);

    const pauseButton = screen.getByTestId("pause");
    expect(pauseButton);
    fireEvent.click(pauseButton);
    expect(screen.getByTestId("play"));
  })

});
