import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Footer from '../../components/Footer.js';
import '../../i18n';

describe('Footer component', () => {
  beforeEach(() => {
    render(
        <Footer />
    );
  });

  it('should render elements', async () => {
    await waitFor(() => screen.getByText(/QUESTIONS API DOC/));

    const link1 = screen.getByText(/QUESTIONS API DOC/);
    await expect(link1).toBeInTheDocument();

    const link2 = screen.getByText(/© WIQ-ES04A/);
    await expect(link2).toBeInTheDocument();

    const link3 = screen.getByText(/USERS API DOC/);
    await expect(link3).toBeInTheDocument();

  });

});
