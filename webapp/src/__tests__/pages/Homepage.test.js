import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Homepage from '../../pages/Homepage.js';

const mockAxios = new MockAdapter(axios);

describe('Homepage component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render elements', async () => {
    render(
      <Router>
        <Homepage />
      </Router>
    );

    await waitFor(() => screen.getByText(/Play/i));

    const playLink = screen.getByRole('button', { name: /Play/i });
    await expect(playLink).toBeInTheDocument();

    const game1 = screen.getByRole('button', { name: /Wise men stack/i});
    await expect(game1).toBeInTheDocument();

    const game2 = screen.getByRole('button', { name: /The challenge/i});
    await expect(game2).toBeInTheDocument();

    const game3 = screen.getByRole('button', { name: /Discovering cities/i});
    await expect(game3).toBeInTheDocument();

    const game4 = screen.getByRole('button', { name: /Warm question/i});
    await expect(game4).toBeInTheDocument();

  });
  
  it('should change game selection page', async () => {
    
    render(
      <Homepage />
    );

    fireEvent.click(screen.getByText('2'));

    await waitFor(() => {
      expect(screen.queryByText('ONLINE MODE')).toBeInTheDocument();
    });
  });


  it('should select a game mode', async () => {
    
    render(
      <Homepage />
    );
    
    fireEvent.click(screen.getByText('WISE MEN STACK'));

    await waitFor(() => {
      expect(screen.getByAltText('WISE MEN STACK')).toBeInTheDocument();
    });


  });
});
