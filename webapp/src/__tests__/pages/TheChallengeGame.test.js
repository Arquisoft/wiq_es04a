import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from '../../pages/TheChallengeGame';

const mockAxios = new MockAdapter(axios);

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mockear respuestas de la API
    mockAxios.onGet(`http://localhost:8000/questions/1/Geography`).reply(200, 
    [
        {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid'
        }
    ]
    );

    mockAxios.onPost(`http://localhost:8000/statistics/edit`).reply(200, { success: true });
    mockAxios.onPost(`http://localhost:8000/user/questionsRecord`).reply(200, { success: true });

  });

  it('should render configuration window and start game', async () => {
    render( 
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
            <Game />
          </Router>
        </SessionContext.Provider>
    );

    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('Game Configuration'));

    // Simula la configuración del juego
    const increaseButtons = screen.getAllByRole('button', { name: '+' });
    fireEvent.click(increaseButtons[0]); // Aumenta el número de rondas
    fireEvent.click(increaseButtons[1]); // Aumenta el tiempo por pregunta
    //fireEvent.change(screen.getByLabelText('Category:'), { target: { value: 'Sports' } });

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));

    // Espera a que aparezca la pregunta
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('1'));
    expect(screen.findByText('1/4'));

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

    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('Game Configuration'));

    // Simula la configuración del juego
    const increaseButtons = screen.getAllByRole('button', { name: '+' });
    fireEvent.click(increaseButtons[0]); // Aumenta el número de rondas

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));

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

    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('Game Configuration'));

    // Simula la configuración del juego
    const increaseButtons = screen.getAllByRole('button', { name: '+' });
    fireEvent.click(increaseButtons[0]); // Aumenta el número de rondas

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));

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

    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('Game Configuration'));

    // Simula la configuración del juego
    const increaseButtons = screen.getAllByRole('button', { name: '+' });
    fireEvent.click(increaseButtons[0]); // Aumenta el número de rondas

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

});