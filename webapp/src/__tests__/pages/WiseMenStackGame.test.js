import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; // Importa el contexto necesario
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import WiseMenStack from '../../pages/WiseMenStackGame';
import '../../localize/i18n';
import { expect } from 'expect-puppeteer';

const mockAxios = new MockAdapter(axios);

describe('Wise Men Stack Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onGet('http://localhost:8000/questions/en/Geography').reply(200, 
        [{
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Geography'],
        language: 'en'
        }]
    );

    mockAxios.onPut('http://localhost:8000/statistics').reply(200, { success: true });
    mockAxios.onPut('http://localhost:8000/user/questionsRecord').reply(200, { success: true });

    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <WiseMenStack />
        </Router>
      </SessionContext.Provider>
    );
  });

  it('should render configuration, question, answers and other ', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);
    
    //expect(screen.getByRole('progressbar'));
    expect(screen.findByText('1'));
    expect(screen.findByText('Question 1'));
    //expect(screen.findByText('1/3'));

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));

    expect(screen.findByText('Which is the capital of Spain?'.toUpperCase()));
    expect(screen.findByText('Madrid'));
    
  });

  it('should mark as correct right answer', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));

    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });
    // now the answer is not selected:
    expect(screen.findByTestId("anwer0"));
    // after clicking it has changed to succeeded:
    fireEvent.click(correctAnswer);
    expect(screen.findByTestId("succes0"));

  });

  it('should mark as incorrect another answer', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));

    const answers = screen.getAllByRole('button');
    const incorrectAnswer = answers[0].name === 'Madrid' ? answers[1] : answers[0];
    const id = answers[0].name === 'Madrid' ? 1 : 0;

    // now the answer is not selected:
    expect(screen.findByTestId(`anwer${id}`));
    // after clicking it has changed to succeeded:
    fireEvent.click(incorrectAnswer);
    expect(screen.findByTestId(`failure${id}`));

  });

  
  it('should only show 2 answers', async () => {    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('should not answer the question', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

  it('should render pause & play buttons when answered', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);

    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });
    fireEvent.click(correctAnswer);

    const pauseButton = screen.getByTestId("pause");
    expect(pauseButton);
    fireEvent.click(pauseButton);
    expect(screen.getByTestId("play"));
  })

  it('should render progress bar', async () => {
    await waitFor(() => screen.getByText('GAME CONFIGURATION'));
    const button = screen.getByTestId('start-button');
    fireEvent.click(button);

    await waitFor(() => screen.getByText('Which is the capital of Spain?'.toUpperCase()));
    const progressBar = screen.getByTestId('prog_bar0');
    await expect(progressBar).toBeInTheDocument();
  })

});
