import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter  } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import { SessionContext } from '../../SessionContext';
import '../../localize/i18n';

describe('NavBar component', () => {
  it('should render logo when not logged', async () => {
    render(
      <SessionContext.Provider value={{}}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const logo = screen.getByAltText('Logo');
    await expect(logo).toBeInTheDocument();
  });

  it('should render logo when logged', async () => {
    render(
      <SessionContext.Provider value={{ isLoggedIn: true }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const logo = screen.getByAltText('Logo');
    await expect(logo).toBeInTheDocument();
  });

  it('should render log-in option', async () => {
    render(
      <SessionContext.Provider value={{}}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const logIn = screen.getByText('Log In');
    await expect(logIn).toBeInTheDocument();
  });

  // As there s a link for the menu (mobiles version) and in the propper nav, we have to check 2 elements appear
  it('should render navigation links', async () => {
    render(
      <SessionContext.Provider value={{ isLoggedIn: true }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    await waitFor(() => screen.getAllByText('Play'));

    const playLinks = screen.getAllByText('Play');
    await expect(playLinks[0]).toBeInTheDocument();
    await expect(playLinks[1]).toBeInTheDocument();

    const statisticsLinks = screen.getAllByText('Statistics');
    await expect(statisticsLinks[0]).toBeInTheDocument();
    await expect(statisticsLinks[1]).toBeInTheDocument();


    const instructionsLinks = screen.getAllByText('Instructions');
    await expect(instructionsLinks[0]).toBeInTheDocument();
    await expect(instructionsLinks[1]).toBeInTheDocument();


    const groupsLinks = screen.getAllByText('Groups');
    await expect(groupsLinks[0]).toBeInTheDocument();
    await expect(groupsLinks[1]).toBeInTheDocument();

  });

  it('should render username logged and its menu', async () => {
    const username = "El menda"
    render(
      <SessionContext.Provider value={{ username: username, isLoggedIn: true }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
    const menuButton = screen.getByLabelText('account of current user');
    fireEvent.click(menuButton);

    const userDisplayed = screen.getByText(username);
    await expect(userDisplayed).toBeInTheDocument();
  });

  it('should call handleLogout function when logout button is clicked', async () => {
    render(
      <SessionContext.Provider value={{ isLoggedIn: true, destroySession: () => {} }}>
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      </SessionContext.Provider>
    );
  
    // Find the logout button using data-testid
    const logoutButton = screen.getByTestId('logout-button');
    await expect(logoutButton).toBeInTheDocument();
  
    // Simulate a click on the logout button and check final route
    //TODO - check call to destroysession
    fireEvent.click(logoutButton);
    expect(window.location.pathname).toBe('/');
  });
});
