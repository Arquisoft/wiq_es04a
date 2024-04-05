import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Statistics from '../../pages/Statistics';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

describe('Statistics component', () => {
  beforeAll(async () => {
    mockAxios.onPost('http://localhost:8000/user/add').reply(200, {
      username: 'testuser',
      password: 'test123',
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
});