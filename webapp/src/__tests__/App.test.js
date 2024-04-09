import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { SessionContext } from '../SessionContext';
import '../i18n';

describe('App component', () => {
  it('renders home page by default', () => {
    render(
        <SessionContext.Provider value={{ isLoggedIn: false }}>
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        </SessionContext.Provider>
    );
    expect(screen.getByText('WIKIDATA')).toBeInTheDocument();
  });

  it('navigates to login page', async () => {
    render(
        <SessionContext.Provider value={{ isLoggedIn: false }}>
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>
        </SessionContext.Provider>
    );

    const loginText = screen.getAllByText('Log In');
    await expect(loginText[0]).toBeInTheDocument();

    const registerText = screen.getByText("Don't have an account? Register here.");
    await expect(registerText).toBeInTheDocument();
  });

});