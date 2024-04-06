import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';

describe('NavBar component', () => {
  it('should render components', async () => {
    render(
      <Home />
    );

    const logo = screen.getByAltText('Logo');
    await expect(logo).toBeInTheDocument();

    const name1 = screen.getByText('WIKIDATA');
    const name2 = screen.getByText('INFINITE');
    const name3 = screen.getByText('QUEST');
    await expect(name1).toBeInTheDocument();
    await expect(name2).toBeInTheDocument();
    await expect(name3).toBeInTheDocument();

    const playButton = screen.getByText('PLAY');
    await expect(playButton).toBeInTheDocument();
  });
});
