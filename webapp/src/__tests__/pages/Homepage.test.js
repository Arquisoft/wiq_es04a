import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Homepage from '../../pages/Homepage';

// Hacemos un mock del módulo '@mui/material' y su hook useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => ({
    __esModule: true, // Esto es necesario para mocks de módulos ES6
    default: jest.fn(), // Mock por defecto para todas las llamadas
  }));

describe('Homepage', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Limpiar todos los mocks después de cada prueba
      });

    it('renders video and play button', () => {
        render(<Homepage />);
        expect(screen.getByTestId('video')).toBeInTheDocument();
        expect(screen.getByText('PLAY')).toBeInTheDocument();
    });

    it('loads game buttons dynamically based on data', async () => {
        render(<Homepage />);
        const buttons = await screen.findAllByRole('button');
        expect(buttons.length).toBe(5); // 5 game buttons + 1 play button
    });

    it('changes game link when a different game is selected', async () => {
        render(<Homepage />);
        const gameButtons =  screen.getAllByRole('button');

        // Click on 'ONLINE MODE' which should be the last button
        fireEvent.click(gameButtons[4]);
        const playButton = screen.getByText('PLAY');
        expect(playButton).toHaveAttribute('href', '/multiplayerRoom');
    });

    it('sets active game correctly and updates link on button click', async () => {
        render(<Homepage />);
        const gameButtons = screen.getAllByRole('button');

        // Assume 'THE CHALLENGE' is the 4th game, button index starts at 0
        fireEvent.click(gameButtons[3]);

        const playButton = screen.getByText('PLAY');
        expect(playButton).toHaveAttribute('href', '/theChallengeGame');
    });

    it('changes game link to discovering', async () => {
        render(<Homepage />);
        const gameButtons =  screen.getAllByRole('button');

        // Click on 'ONLINE MODE' which should be the last button
        fireEvent.click(gameButtons[2]);
        const playButton = screen.getByText('PLAY');
        expect(playButton).toHaveAttribute('href', '/discoveringCitiesGame');
    });

    it('changes game link to warm question', async () => {
        render(<Homepage />);
        const gameButtons =  screen.getAllByRole('button');

        // Click on 'ONLINE MODE' which should be the last button
        fireEvent.click(gameButtons[1]);
        const playButton = screen.getByText('PLAY');
        expect(playButton).toHaveAttribute('href', '/warmQuestionGame');
    });

    it('changes game link to wise men stack', async () => {
        render(<Homepage />);
        const gameButtons =  screen.getAllByRole('button');

        // Click on 'ONLINE MODE' which should be the last button
        fireEvent.click(gameButtons[0]);
        const playButton = screen.getByText('PLAY');
        expect(playButton).toHaveAttribute('href', '/wiseMenStackGame');
    });

    it('respects the xxl media query', () => {

        const useMediaQuery = require('@mui/material/useMediaQuery').default;
        useMediaQuery.mockImplementation(() => true); // Simula una media query verdadera
        render(<Homepage />);
        const gameButtons =  screen.getAllByRole('button');
        expect(gameButtons[4]).toHaveStyle({ width: '20rem' }); // Checks style from 'playButton' style in xxl condition
    });
});