import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../localize/i18n';
import TheChallengeGame from '../../pages/TheChallengeGame';

const mockAxios = new MockAdapter(axios);

describe('The Challenge component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mockear respuestas de la API
    mockAxios.onGet(`http://localhost:8000/questions/en/Geography`).reply(200, 
    [
        {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid'
        }
    ]
    );

    mockAxios.onPut(`http://localhost:8000/statistics`).reply(200, { success: true });
    mockAxios.onPut(`http://localhost:8000/questionsRecord`).reply(200, { success: true });

    render(
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
          <Router>
              <TheChallengeGame />
          </Router>
      </SessionContext.Provider>
    );
  });

  it('should render configuration window and start game', async () => {
    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));

    // Simula la configuración del juego
    const increaseButton = screen.getByTestId('addRound');
    fireEvent.click(increaseButton); // Aumenta el número de rondas

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    // Espera a que aparezca la pregunta
    await waitFor(() => screen.getByTestId('question'));

    // Verifica que el juego haya comenzado correctamente mostrando la pregunta y las opciones
    expect(screen.getByTestId('question')).toBeInTheDocument();
    expect(screen.getByText('Madrid')).toBeInTheDocument();
    expect(screen.getByText('Barcelona')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
  });

  it('should guess correct answer', async () => {
    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));

    // Simula la configuración del juego
    const increaseRoundButton = screen.getByTestId('addRound');
    fireEvent.click(increaseRoundButton); // Aumenta el número de rondas
    const increaseSecondsButton = screen.getByTestId('addSecond');
    fireEvent.click(increaseSecondsButton); // Aumenta los segundos por ronda

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    //selects correct answer
    fireEvent.click(correctAnswer);
    
    expect(screen.findByTestId("success0"));

  });

  
  it('should choose incorrect answer', async () => {
    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));

    // Simula la configuración del juego
    const increaseButton = screen.getByTestId('addRound');
    fireEvent.click(increaseButton); // Aumenta el número de rondas

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });
    
    //selects correct answer
    fireEvent.click(incorrectAnswer);
    expect(screen.findByTestId("fail1"));

  });

  it('should not answer the question', async () => {
    // Espera a que aparezca la ventana de configuración
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));

    // Simula la configuración del juego
    const increaseButton = screen.getByTestId('addRound');
    fireEvent.click(increaseButton); // Aumenta el número de rondas

    // Inicia el juego
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

  it('should pause and resume the game after answering a question', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    fireEvent.click(screen.getByTestId('addRound'));
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }));

    await waitFor(() => screen.getByTestId('question'));

    fireEvent.click(screen.getByRole('button', { name: 'Madrid' }));

    await waitFor(() => screen.getByTestId('pause'));

    fireEvent.click(screen.getByTestId('pause'));

    expect(screen.getByTestId('play')).toBeInTheDocument();
  });

});