import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';
import { BrowserRouter  } from 'react-router-dom';
import { SessionContext } from '../../SessionContext';
import userEvent from '@testing-library/user-event';
import '../../localize/i18n';

describe('NavBar component', () => {

    beforeEach(() => {
        render(
            <SessionContext.Provider value={{}}>
                <BrowserRouter>
                    <Home/>
                </BrowserRouter>
            </SessionContext.Provider>
        );
    });

    it('should render components', async () => {
        const logo = screen.getByAltText('Logo');
        await expect(logo).toBeInTheDocument();

        const name1 = screen.getByText('WIKIDATA');
        const name2 = screen.getByText('INFINITE');
        const name3 = screen.getByText('QUEST');
        await expect(name1).toBeInTheDocument();
        await expect(name2).toBeInTheDocument();
        await expect(name3).toBeInTheDocument();
    });

    it('button play functions as expected', async () => {
        const playButton = screen.getByText('PLAY');
        await expect(playButton).toBeInTheDocument();

        userEvent.click(playButton);
        expect(window.location.pathname).toBe('/');
    });
});

