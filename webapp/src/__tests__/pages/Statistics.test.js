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

describe('Statistics component', () => {
  beforeAll(async () => {
    mockAxios.onPost('http://localhost:8000/user/add').reply(200, {
      username: 'testuser',
      password: 'test123', //NOSONAR
      name: 'Test',
      surname: 'User'
    });
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
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
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
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Questions:')).toBeInTheDocument();
    expect(screen.getByText('Passed Questions:')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(4);
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
    expect(screen.getByText('Earned Money:')).toBeInTheDocument();
    expect(screen.getByText('0 €')).toBeInTheDocument();
    expect(screen.getByText('Correctly Answered Cities:')).toBeInTheDocument();
    expect(screen.getByText('Incorrectly Answered Cities:')).toBeInTheDocument();
    expect(screen.getByText('Games Played:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});