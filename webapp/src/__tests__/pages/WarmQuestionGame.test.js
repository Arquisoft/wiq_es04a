import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import WarmQuestionGame from '../../pages/WarmQuestionGame';

const mockAxios = new MockAdapter(axios);

describe('WarmQuestionGame component', () => { 
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onGet('http://localhost:8000/questions/en').reply(200, 
        {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Geography'],
        language: 'en'
        }
    );

    mockAxios.onPut('http://localhost:8000/statistics').reply(200, { success: true });
    mockAxios.onPut('http://localhost:8000/questionsRecord').reply(200, { success: true });
  });

  it('should render question, answers and other', async () => {
    render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <WarmQuestionGame />
          </Router>
        </SessionContext.Provider>
    );

    // Espera a que aparezca la pregunta
    await waitFor(() => screen.getByTestId('question'));

    expect(screen.findByText('1'));

    // Verifica que el juego haya comenzado correctamente mostrando la pregunta y las opciones
    expect(screen.getByTestId('question')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
    expect(screen.getByText('Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
  });

  it('should guess correct answer', async () => {
    render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <WarmQuestionGame />
          </Router>
        </SessionContext.Provider>
    );

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'rgb(0, 102, 153);' });

    //selects correct answer
    fireEvent.click(correctAnswer);

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'rgb(51, 153, 102);' });

  });

  
  it('should choose incorrect answer', async () => {
     render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <WarmQuestionGame />
          </Router>
        </SessionContext.Provider>
    );

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });

    expect(incorrectAnswer).toHaveStyle({ backgroundColor: 'rgb(0, 102, 153);' });

    //selects correct answer
    fireEvent.click(incorrectAnswer);

    expect(incorrectAnswer).toHaveStyle({ backgroundColor: 'rgb(153, 0, 0);' });

  });

  it('should not answer the question', async () => {
    render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <WarmQuestionGame />
          </Router>
        </SessionContext.Provider>
    );

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

  it('should pass the question', async () => {
    render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <WarmQuestionGame />
          </Router>
        </SessionContext.Provider>
    );

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });
    const skip = screen.getByRole('button', { name: 'Skip' });

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'rgb(0, 102, 153);' });

    //selects correct answer
    fireEvent.click(skip);

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'rgb(51, 153, 102);' });

  });


});