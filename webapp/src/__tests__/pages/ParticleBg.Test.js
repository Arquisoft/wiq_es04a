import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Para tener acceso a los matchers de jest-dom
import ParticlesComponent from '../../components/ParticleBg';

describe('ParticlesComponent', () => {

  // Prueba individual para renderizar el componente
  it('renders the particles component correctly', async () => {
    render(<ParticlesComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('tsparticles')).toBeInTheDocument();
    });
  });

  // Prueba para verificar la aplicación correcta de estilos
  it('applies correct styles to the container', async () => {
    render(<ParticlesComponent />);
    const particlesContainer = await screen.findByTestId('tsparticles');
    expect(particlesContainer).toHaveStyle('zIndex: -1');
  });

});