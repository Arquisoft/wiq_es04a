import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; // Importa el contexto necesario
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from '../../pages/DiscoveringCitiesGame';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onGet('http://localhost:8000/questions/en/Cities').reply(200, 
        [{
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Cities'],
        language: 'en'
        }]
    );

    mockAxios.onPut('http://localhost:8000/statistics').reply(200, { success: true });
    mockAxios.onPut('http://localhost:8000/questionsRecord').reply(200, { success: true });

  });

  it('should render question, answers and other ', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
        </Router>
      </SessionContext.Provider>
    );

    expect(screen.getByRole('progressbar'));
    //expect(screen.findByText('1'));
    //expect(screen.findByText('1/5'));

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('Which is the capital of Spain?'));
    expect(screen.findByText('Madrid'));
    expect(screen.findByText('Barcelona'));
    expect(screen.findByText('Paris'));
    expect(screen.findByText('London'));
    
    expect(screen.getByRole('button', { name: /Pause/i }));

  });

  it('should guess correct answer', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
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
          <Game />
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
    //expect(screen.findByText('1')).toHaveStyle({ backgroundColor: 'salmon' });

  });

  it('should not answer the question', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
        </Router>
      </SessionContext.Provider>
    );

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

});
