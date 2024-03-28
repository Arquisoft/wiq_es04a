import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Game from './Game';

const mockAxios = new MockAdapter(axios);

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/questions').reply(200, 
        {
        question: 'Which is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Paris', 'London'],
        correctAnswer: 'Madrid',
        categories: ['Geography'],
        language: 'en'
        }
    );
  });

  it('should render question and answers', async () => {
    render(<Game />);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));

    expect(screen.findByText('Which is the capital of Spain?'));
    expect(screen.findByText('Madrid'));
    expect(screen.findByText('Barcelona'));
    expect(screen.findByText('Paris'));
    expect(screen.findByText('London'));

  });

  it('should guess correct answer', async () => {
    render(<Game />);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const correctAnswer = screen.getByRole('button', { name: 'Madrid' });

    expect(correctAnswer).not.toHaveStyle({ color: 'green' });

    //selects correct answer
    fireEvent.click(correctAnswer);

    expect(correctAnswer).toHaveStyle({ color: 'green' });

  });

  
  it('should choose incorrect answer', async () => {
    render(<Game />);

    // waits for the question to appear
    await waitFor(() => screen.getByText('Which is the capital of Spain?'));
    const incorrectAnswer = screen.getByRole('button', { name: 'Barcelona' });

    expect(incorrectAnswer).not.toHaveStyle({ color: 'red' });

    //selects correct answer
    fireEvent.click(incorrectAnswer);

    expect(incorrectAnswer).toHaveStyle({ color: 'red' });

  });

});
