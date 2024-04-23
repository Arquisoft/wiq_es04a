import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { SessionContext } from '../../SessionContext';
import Profile from '../../pages/Profile';

const mockAxios = new MockAdapter(axios);
 
describe('Profile component', () => {
  const username = 'testuser';
  const initialUserInfo = {
    username: username,
    name: 'Test',
    surname: 'User',
    createdAt: '2021-01-01T00:00:00Z',
    imageUrl: 'default_user.jpg'
  };

  beforeEach(() => {
    mockAxios.reset(); 
  });

  it('should fetch and display user information', async () => {
    mockAxios.onGet(`http://localhost:8000/profile`, { params: { username } }).reply(200, initialUserInfo);
    render(
      <SessionContext.Provider value={{ username }}>
        <Router>
          <Profile />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText(new Date(initialUserInfo.createdAt).toLocaleDateString())).toBeInTheDocument();
      expect(screen.getByAltText('Profile pic')).toHaveAttribute('src', initialUserInfo.imageUrl);
    });
  });

  it('should display an error if fetching user info fails', async () => {
    mockAxios.onGet(`http://localhost:8000/profile`, { params: { username } }).reply(400, { error: 'Error fetching user information' });

    render(
      <SessionContext.Provider value={{ username }}>
        <Router>
          <Profile />
        </Router>
      </SessionContext.Provider>
    );
  });

  it('should handle avatar selection and update', async () => {
    const newAvatar = 'bertinIcon.jpg';
    mockAxios.onGet(`http://localhost:8000/profile`, { params: { username } }).reply(200, initialUserInfo);
    mockAxios.onPut(`http://localhost:8000/profile/${username}`, { imageUrl: newAvatar }).reply(200);

    render(
      <SessionContext.Provider value={{ username }}>
        <Router>
          <Profile />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('alberto-button'));
    fireEvent.click(screen.getByTestId('confirm-button'));
  });

  it('should handle avatar selection and update after choosing different characters', async () => {
    const newAvatar = 'teresaIcon.jpg';
    mockAxios.onGet(`http://localhost:8000/profile`, { params: { username } }).reply(200, initialUserInfo);
    mockAxios.onPut(`http://localhost:8000/profile/${username}`, { imageUrl: newAvatar }).reply(200);

    render(
      <SessionContext.Provider value={{ username }}>
        <Router>
          <Profile />
        </Router>
      </SessionContext.Provider> 
    ); 

    await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('hugo-button'));
    fireEvent.click(screen.getByTestId('alberto-button'));
    fireEvent.click(screen.getByTestId('wiffo-button'));
    fireEvent.click(screen.getByTestId('andina-button'));
    fireEvent.click(screen.getByTestId('samu-button'));
    fireEvent.click(screen.getByTestId('barrero-button'));
    fireEvent.click(screen.getByTestId('maite-button'));
    fireEvent.click(screen.getByTestId('confirm-button'));

  });

  it('should display an error if avatar update fails', async () => {
    const newAvatar = 'bertinIcon.jpg';
    mockAxios.onGet(`http://localhost:8000/profile`, { params: { username } }).reply(200, initialUserInfo);
    mockAxios.onPost(`http://localhost:8000/profile/${username}`, { imageUrl: newAvatar }).reply(400, { error: 'Error updating user information' });

    render(
      <SessionContext.Provider value={{ username }}>
        <Router>
          <Profile />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('ALBERT'));
    fireEvent.click(screen.getByTestId('confirm-button'));
  });

  

});