import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Homepage from '../pages/Homepage.js';

const mockAxios = new MockAdapter(axios);

describe('Homepage component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should appear "Play" button', async () => {
    render(
      <Router>
        <Homepage />
      </Router>
    );

    const playLink = screen.getByRole('link', { name: /Play/i });
    expect(playLink).toBeInTheDocument();
   
  });
});
