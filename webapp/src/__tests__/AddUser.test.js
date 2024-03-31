import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AddUser from '../pages/AddUser';

const mockAxios = new MockAdapter(axios);

describe('AddUser component', () => {
  beforeEach(() => {
    mockAxios.reset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/user/add').reply(200);
    mockAxios.onPost('http://localhost:8000/login').reply(200);
  });

  it('should render sign up form', () => {
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <AddUser />
        </Router>
      </SessionContext.Provider>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Surname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Already have an account? Login here.' })).toBeInTheDocument();
  });

  it('should sign up a user', async () => {
    render(
      <SessionContext.Provider value={{ createSession: jest.fn() }}>
        <Router>
          <AddUser />
        </Router>
      </SessionContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Surname'), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(2); // Ensure two POST requests are made
    });
  });

  it('should show error message if sign up fails', async () => {
    mockAxios.onPost('http://localhost:8000/user/add').reply(400, { error: 'Username already exists' });

    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <AddUser />
        </Router>
      </SessionContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Error: Username already exists')).toBeInTheDocument();
    });
  });
});