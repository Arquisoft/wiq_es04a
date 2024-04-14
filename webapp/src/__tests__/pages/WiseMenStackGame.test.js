import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext'; // Importa el contexto necesario
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from '../../pages/WiseMenStackGame';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);

describe('Wise Men Stack Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onGet('http://localhost:8000/questions/Geography').reply(200, 
        {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Geography'],
        language: 'en'
        }
    );

    mockAxios.onPost('http://localhost:8000/statistics/edit').reply(200, { success: true });
    mockAxios.onPost('http://localhost:8000/user/questionsRecord').reply(200, { success: true });

  });

  it('should render configuration, question, answers and other ', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
        </Router>
      </SessionContext.Provider>
    );

    //await waitFor(() => screen.getByText('Choose a category:'));
    await waitFor(() =>screen.findByTestId('categories-label'));
    await expect(screen.findByTestId('categories-label'));
    const button = await screen.findByTestId('start-button');
    fireEvent.click(button);
    
    expect(screen.getByRole('progressbar'));
    expect(screen.findByText('1'));
    expect(screen.findByText('Question 1'));
    //expect(screen.findByText('1/3'));

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('Which is the capital of Spain?'));
    expect(screen.findByText('Madrid'));
    
  });

  it('should guess correct answer', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
        </Router>
      </SessionContext.Provider>
    );
    //await waitFor(() => screen.getByText('Choose a category:'));

    expect(screen.findByTestId('categories-label'));
    const button = await screen.findByTestId('start-button');
    fireEvent.click(button);
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
    //await waitFor(() => screen.getByText('Choose a category:'));

    expect(screen.findByTestId('categories-label'));
    const button = await screen.findByTestId('start-button');
    fireEvent.click(button);
    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const incorrectAnswer1 = screen.getByRole('button', { name: 'Barcelona' });
    const incorrectAnswer2 = screen.getByRole('button', { name: 'Paris' });
    const incorrectAnswer3 = screen.getByRole('button', { name: 'London' });

    if(incorrectAnswer1) {
        expect(incorrectAnswer1).not.toHaveStyle({ backgroundColor: 'red' });
        fireEvent.click(incorrectAnswer1);
        expect(incorrectAnswer1).toHaveStyle({ backgroundColor: 'red' });
    } else if(incorrectAnswer2) {
        expect(incorrectAnswer2).not.toHaveStyle({ backgroundColor: 'red' });
        fireEvent.click(incorrectAnswer2);
        expect(incorrectAnswer2).toHaveStyle({ backgroundColor: 'red' });
    } else if(incorrectAnswer3) {
        expect(incorrectAnswer3).not.toHaveStyle({ backgroundColor: 'red' });
        fireEvent.click(incorrectAnswer3);
        expect(incorrectAnswer3).toHaveStyle({ backgroundColor: 'red' });
    }

    
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

    //await waitFor(() => screen.getByText('Choose a category:'));

    await expect(screen.findByTestId('categories-label'));
    const button = await screen.findByTestId('start-button');
    fireEvent.click(button);


    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    setTimeout(() => {
      // Comprobamos que el callback ha sido llamado después del tiempo especificado
      done(); // Llamamos a done para indicar que la prueba ha terminado
    }, 4000);

  }, 4500);

});
