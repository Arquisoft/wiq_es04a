import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Homepage from './Homepage.js';

const mockAxios = new MockAdapter(axios);

describe('Homepage component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should start game', async () => {
    render(<Homepage />);

    const playButton = screen.getByRole('button', { name: /Play/i });
    expect(playButton).toBeInTheDocument();

    fireEvent.click(playButton);

    await waitFor(() => screen.getByText('Game time:'));
    expect(screen.getByText('Game time:')).toBeInTheDocument();

  });
});
