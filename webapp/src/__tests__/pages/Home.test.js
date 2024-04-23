import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';

// Hacemos un mock del módulo '@mui/material' y su hook useMediaQuery
jest.mock('@mui/material/useMediaQuery', () => ({
    __esModule: true, // Esto es necesario para mocks de módulos ES6
    default: jest.fn(), // Mock por defecto para todas las llamadas
  }));

describe('Componente Home', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Limpiar todos los mocks después de cada prueba
      });

    it('debe aplicar estilos a la foto', () => {
        render(<Home />);
        expect(screen.getByAltText('Logo')).toHaveStyle('width: 100%');
    });

    it('debe reproducir el video a una velocidad de 0.85', async () => {
        render(<Home />);
        const videoElement = screen.getByTestId('video');
        expect(videoElement).toBeInTheDocument();
        expect(videoElement.playbackRate).toBe(0.85);

    });

    it('debe aplicar estilos maxLogo si la media query xxl es verdadera', () => {
        const useMediaQuery = require('@mui/material/useMediaQuery').default;
        useMediaQuery.mockImplementation(() => true); // Simula una media query verdadera

        render(<Home />);
        const box = screen.getByTestId('xxl');
        expect(box).toHaveStyle(`width: 35em`); // Verifica que se aplican los estilos de maxLogo
      });

});

