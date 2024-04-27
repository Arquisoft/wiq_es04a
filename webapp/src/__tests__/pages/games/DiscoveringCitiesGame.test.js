import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DiscoveringCitiesGame from '../../../pages/games/DiscoveringCitiesGame';
import '../../../localize/i18n';

const mockAxios = new MockAdapter(axios);
 
describe('Discovering Cities component', () => {
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
          <DiscoveringCitiesGame />
        </Router>
      </SessionContext.Provider>
    );

    expect(screen.getByRole('progressbar'));

    // waits for the question to appear
    await waitFor(() => screen.getByTestId('question'));

    expect(screen.getByTestId('question'));
    expect(screen.findByText('Madrid'));
    expect(screen.findByText('Barcelona'));
    expect(screen.findByText('Paris'));
    expect(screen.findByText('London'));

  });

  it('should guess correct answer', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <DiscoveringCitiesGame />
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
          <DiscoveringCitiesGame />
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
          <DiscoveringCitiesGame />
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

  it('should pause and resume the game after answering a question', async () => {
    render(
        <SessionContext.Provider value={{ username: 'exampleUser' }}>
            <Router>
                <DiscoveringCitiesGame />
            </Router>
        </SessionContext.Provider>
    );

    await waitFor(() => screen.getByTestId('question'));

    fireEvent.click(screen.getByRole('button', { name: 'Madrid' }));

    await waitFor(() => screen.getByTestId('pause'));

    fireEvent.click(screen.getByTestId('pause'));

    expect(screen.getByTestId('play')).toBeInTheDocument();
  });

});
