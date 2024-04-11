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

    mockAxios.onPost('http://localhost:8000/statistics/edit').reply(200, { success: true });
    mockAxios.onPost('http://localhost:8000/user/questionsRecord').reply(200, { success: true });

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
    expect(screen.findByText('1'));
    expect(screen.findByText('1/3'));

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

  /*it('should pass rounds', async () => {
    render( 
      <SessionContext.Provider value={{ username: 'exampleUser' }}>
        <Router>
          <Game />
        </Router>
      </SessionContext.Provider>
    );

    //FIRST ROUND

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    var correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(correctAnswer).not.toHaveStyle({ backgroundColor: 'green' });

    //selects correct answer
    fireEvent.click(correctAnswer);

    //expect(screen.findByText('1')).toHaveStyle({ backgroundColor: 'lightgreen' });

    expect(correctAnswer).toHaveStyle({ backgroundColor: 'green' });
    setTimeout(() => {
    }, 3000);


    // SECOND ROUND
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    //expect(screen.findByText('2/3')).toBeInTheDocument();
    console.log(screen.getByTestId("numRound"));
    await expect(screen.getByTestId("numRound")).toBeInTheDocument(); 
    correctAnswer = screen.getByRole('button', { name: 'Madrid' });
    fireEvent.click(correctAnswer);
    expect(correctAnswer).toHaveStyle({ backgroundColor: 'green' });

    setTimeout(() => {
    }, 3000);


    // THIRD ROUND
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('3/3'));
    await expect(screen.getByTestId("numRound")); 
    correctAnswer = screen.getByRole('button', { name: 'Madrid' });
    fireEvent.click(correctAnswer);
    expect(correctAnswer).toHaveStyle({ backgroundColor: 'green' });

    setTimeout(() => {
    }, 3000);

    console.log(screen.getByTestId("numRound")); 
    //END OF THE GAME
    //await expect(screen.getByTestId("end-game-message")); 

    //await waitFor(() => screen.getByTestId("end-game-message"));
    /*await expect(screen.findByText('Correct Answers:'));
    await expect(screen.findByText('Incorrect Answers:'));
    await expect(screen.findByText('Total money:'));
    await expect(screen.findByText('Game time:'));



  });*/

});
