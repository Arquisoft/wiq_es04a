import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Statistics from '../../pages/Statistics';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    user: 'testuser'
  })
}));
 
describe('Statistics component', () => {
  beforeAll(async () => {
    mockAxios.onGet('http://localhost:8000/user/statistics/testuser',{ params: { loggedUser: "testuser" } }).reply(200, {
      wise_men_stack_earned_money: 50,
      wise_men_stack_correctly_answered_questions: 8,
      wise_men_stack_incorrectly_answered_questions: 12,
      wise_men_stack_games_played: 15,
      warm_question_earned_money: 75,
      warm_question_correctly_answered_questions: 15,
      warm_question_incorrectly_answered_questions: 3,
      warm_question_passed_questions: 12,
      warm_question_games_played: 10,
      discovering_cities_earned_money: 90,
      discovering_cities_correctly_answered_questions: 18,
      discovering_cities_incorrectly_answered_questions: 6,
      discovering_cities_games_played: 12,
      online_earned_money: 15,
      online_correctly_answered_questions: 2,
      online_incorrectly_answered_questions: 3,
      online_total_time_played: 10,
      online_games_played: 12,
    });
    
    mockAxios.onGet('http://localhost:8000/questionsRecord/testuser/TheChallenge').reply(200, [
      {
        createdAt: '2024-04-11T12:00:00Z',
        questions: [
        {
          question: 'What is 1 + 1?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '2',
          response: '2',
        },
        ],
      },
    ]);

    mockAxios.onGet('http://localhost:8000/questionsRecord/testuser/WiseMenStack').reply(200, [
      {
        createdAt: '2024-04-11T12:00:00Z',
        questions: [
        {
          question: 'What is 1 + 1?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '2',
          response: '2',
        },
        ],
      },
    ]);

    mockAxios.onGet('http://localhost:8000/questionsRecord/testuser/WarmQuestion').reply(200, [
      {
        createdAt: '2024-04-11T12:00:00Z',
        questions: [
        {
          question: 'What is 1 + 1?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '2',
          response: '2',
        },
        ],
      },
    ]);

    mockAxios.onGet('http://localhost:8000/questionsRecord/testuser/DiscoveringCities').reply(200, [
      {
        createdAt: '2024-04-11T12:00:00Z',
        questions: [
        {
          question: 'What is 1 + 1?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '2',
          response: '2',
        },
        ],
      },
    ]);

    mockAxios.onGet('http://localhost:8000/questionsRecord/testuser/OnlineMode').reply(200, [
      {
        createdAt: '2024-04-11T12:00:00Z',
        questions: [
        {
          question: 'What is 1 + 1?',
          options: ['1', '2', '3', '4'],
          correctAnswer: '2',
          response: '2',
        },
        ],
      },
    ]);
  });

  it('should render Statistics component with correct user statistics', async () => {
    render(
      <SessionContext.Provider value={{ username: 'testuser' }}>
        <Router>
          <Statistics />
        </Router>
      </SessionContext.Provider>
    );

    await screen.findByText('STATISTICS');

    expect(screen.getByText('Total Points:')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Total Time Played:')).toBeInTheDocument();
    expect(screen.getByText(/^0\s''$/)).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(4);

    fireEvent.click(screen.getByText('Show Questions Record'));

    await screen.findByText('Game 04/11/2024, 14:00');
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render Statistics component with correct user statistics for Wise Men Stack mode', async () => {
    render(
      <SessionContext.Provider value={{ username: 'testuser' }}>
        <Router>
          <Statistics />
        </Router>
      </SessionContext.Provider>
    );

    await screen.findByText('STATISTICS');

    fireEvent.click(screen.getByText('Wise Men Stack'));

    expect(screen.getByText('Wise Men Stack')).toBeInTheDocument();
    expect(screen.getByText('Total Points:')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getAllByText('8'));
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getAllByText('12'));
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('15'));

    fireEvent.click(screen.getByText('Show Questions Record'));

    await screen.findByText('Game 04/11/2024, 14:00');
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render Statistics component with correct user statistics for Warm Question mode', async () => {
    render(
      <SessionContext.Provider value={{ username: 'testuser' }}>
        <Router>
          <Statistics />
        </Router>
      </SessionContext.Provider>
    );

    await screen.findByText('STATISTICS');

    fireEvent.click(screen.getByText('Warm Question'));

    expect(screen.getByText('Warm Question')).toBeInTheDocument();
    expect(screen.getByText('Total Points:')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getAllByText('15'));
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getAllByText('3'));
    expect(screen.getByText('Passed Questions:')).toBeInTheDocument();
    expect(screen.getAllByText('12'));
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('10'));

    fireEvent.click(screen.getByText('Show Questions Record'));

    await screen.findByText('Game 04/11/2024, 14:00');
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render Statistics component with correct user statistics for Discovering Cities mode', async () => {
    render(
      <SessionContext.Provider value={{ username: 'testuser' }}>
        <Router>
          <Statistics />
        </Router>
      </SessionContext.Provider>
    );

    await screen.findByText('STATISTICS');

    fireEvent.click(screen.getByText('Discovering Cities'));

    expect(screen.getByText('Discovering Cities')).toBeInTheDocument();
    expect(screen.getByText('Total Points:')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Cities:')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Cities:')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('12'));

    fireEvent.click(screen.getByText('Show Questions Record'));

    await screen.findByText('Game 04/11/2024, 14:00');
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render Statistics component with correct user statistics for Online mode', async () => {
    render(
      <SessionContext.Provider value={{ username: 'testuser' }}>
        <Router>
          <Statistics />
        </Router>
      </SessionContext.Provider>
    );

    await screen.findByText('STATISTICS');

    fireEvent.click(screen.getByText('Online Mode'));

    expect(screen.getByText('Online Mode')).toBeInTheDocument();
    expect(screen.getByText('Total Points:')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Total Time Played:')).toBeInTheDocument();
    expect(screen.getByText(/^10\s''$/)).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('12'));

    fireEvent.click(screen.getByText('Show Questions Record'));

    await screen.findByText('Game 04/11/2024, 14:00');
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument();
  });
});