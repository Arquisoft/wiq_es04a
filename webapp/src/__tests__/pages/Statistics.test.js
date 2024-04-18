import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Statistics from '../../pages/Statistics';
import { SessionContext } from '../../SessionContext';
import axios from 'axios';

jest.mock('axios');

describe('Statistics component', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  const renderStatisticsComponent = async () => {
    const userStaticsMock = {
      the_callenge_earned_money: 100,
      the_callenge_correctly_answered_questions: 20,
      the_callenge_incorrectly_answered_questions: 5,
      the_callenge_total_time_played: 3600,
      the_callenge_games_played: 10,
    };

    axios.get.mockResolvedValueOnce({ data: userStaticsMock });

    render(
      <SessionContext.Provider value={{ username: 'testuser' }}>
        <Statistics />
      </SessionContext.Provider>
    );

    await screen.findByText('STATISTICS');
  };

  it('should render statistics for "The Challenge" mode by default', async () => {
    await renderStatisticsComponent();

    expect(screen.getByText('The Challenge')).toBeInTheDocument();
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Total Time Played:')).toBeInTheDocument();
    expect(screen.getByText(/^0\s''$/)).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });

  it('should render Statistics component with correct user statistics for Wise Men Stack mode', async () => {
    await renderStatisticsComponent();

    fireEvent.click(screen.getByText('Wise Men Stack'));

    expect(screen.getByText('Wise Men Stack')).toBeInTheDocument();
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });

  it('should render Statistics component with correct user statistics for Warm Question mode', async () => {
    await renderStatisticsComponent();

    fireEvent.click(screen.getByText('Warm Question'));

    expect(screen.getByText('Warm Question')).toBeInTheDocument();
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Passed Questions:')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(4);
  });

  it('should render Statistics component with correct user statistics for Discovering Cities mode', async () => {
    await renderStatisticsComponent();

    fireEvent.click(screen.getByText('Discovering Cities'));

    expect(screen.getByText('Discovering Cities')).toBeInTheDocument();
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Cities:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Cities:')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});