import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../../pages/Login';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200);
  });

  it('should render login form', () => {
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Login />
        </Router>
      </SessionContext.Provider>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Don\'t have an account? Register here.' })).toBeInTheDocument();
  });

  it('should log in a user', async () => {
    render(
      <SessionContext.Provider value={{ createSession: jest.fn() }}>
        <Router>
          <Login />
        </Router>
      </SessionContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1); // Ensure one POST request is made
    });
  });

  it('should show error message if log in fails', async () => {
    mockAxios.onPost('http://localhost:8000/login').reply(400, { error: 'The username cannot contain only spaces' });

    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Login />
        </Router>
      </SessionContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: '    ' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(screen.getByText('Error: The username cannot contain only spaces')).toBeInTheDocument();
    });
  });
});