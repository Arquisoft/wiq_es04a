import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from '../../pages/WarmQuestionGame';

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

    mockAxios.onPatch('http://localhost:8000/statistics').reply(200, { success: true });
    mockAxios.onPost('http://localhost:8000/user/questionsRecord').reply(200, { success: true });
  });

  it('should render question, answers and other', async () => {
    render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <Game />
          </Router>
        </SessionContext.Provider>
    );

    // Espera a que aparezca la pregunta
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('1'));

    // Verifica que el juego haya comenzado correctamente mostrando la pregunta y las opciones
    expect(screen.getByText('Which is the capital of Spain?')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
    expect(screen.getByText('Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
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

  it('should pass the question', async () => {
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
    const skip = screen.getByRole('button', { name: 'Skip' });

    expect(correctAnswer).not.toHaveStyle({ backgroundColor: 'green' });

    //selects correct answer
    fireEvent.click(skip);

    //expect(screen.findByText('1')).toHaveStyle({ backgroundColor: 'lightgreen' });

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'green' });

  });


});