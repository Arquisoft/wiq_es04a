import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Register from '../../pages/Register';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register component', () => {
  beforeEach(() => {
    mockAxios.reset();
    mockNavigate.mockReset();
    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/user').reply(200);
    mockAxios.onPost('http://localhost:8000/login').reply(200, { avatar: 'bertinIcon.jpg' });
  });

  it('should render sign up form', () => {
    render(
      <SessionContext.Provider value={{}}>
      <RouterProvider router={createMemoryRouter([{ path: '/', element: <Register /> }])}>
        <Register />
      </RouterProvider>
      </SessionContext.Provider>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Surname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Already have an account? Login here.' })).toBeInTheDocument();
  });

  it('should sign up a user', async () => {
    const createSession = jest.fn();
    const updateAvatar = jest.fn();

    render(
      <SessionContext.Provider value={{ createSession, updateAvatar }}>
        <RouterProvider router={createMemoryRouter([{ path: '/', element: <Register /> }])}>
          <Register />
        </RouterProvider>
      </SessionContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Surname'), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(2); // Ensure two POST requests are made
    });
  });

  it('should show error message if sign up fails', async () => {
    mockAxios.onPost('http://localhost:8000/user').reply(400, { error: 'Username already exists' });

    render(
      <SessionContext.Provider value={{}}>
        <RouterProvider router={createMemoryRouter([{ path: '/', element: <Register /> }])}>
          <Register />
        </RouterProvider>
      </SessionContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(screen.getByText('Error: Username already exists')).toBeInTheDocument();
    });
  });
});