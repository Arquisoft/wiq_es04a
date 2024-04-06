
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../../pages/Home.js";

describe("Home Component", () => {


    it('renders Typography components', () => {
        render(<Home />);
        const typographyWikidata = screen.getByText('wikidata');
        const typographyInfinite = screen.getByText('infinite');
        const typographyQuest = screen.getByText('quest');
        expect(typographyWikidata).toBeInTheDocument();
        expect(typographyInfinite).toBeInTheDocument();
        expect(typographyQuest).toBeInTheDocument();
      });

    
      it('renders play button', () => {
        render(<Home />);
        const playButton = screen.getByText('Play');
        expect(playButton).toBeInTheDocument();
    });

    it('play button has correct styles', () => {
        render(<Home />);
        const playButton = screen.getByText('Play');
        expect(playButton).toHaveStyle(`
          height: 4rem;
          width: 13rem;
          marginTop: 5vh;
          fontSize: 1.5rem;
          fontFamily: Arial Black, sans-serif;
          color: #339966;
          backgroundColor: transparent;
          border: 2px solid #339966;
          transition: background-color 0.3s ease;
        `);
      });

    it('play button links to correct path', () => {
        render(<Home />);
        const playButton = screen.getByText('PLAY');
        expect(playButton).toHaveAttribute('href', '/login');
    });  
});
