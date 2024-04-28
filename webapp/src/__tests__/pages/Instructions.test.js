import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Instructions from '../../pages/Instructions';
import { BrowserRouter as Router } from 'react-router-dom';
import '../../localize/i18n';

jest.mock('../../data/gameInfo.json', () => ({
  __esModule: true,
  default: [
        {
      nombre: "Wise Men Stack",
      description: "The player chooses a topic from some available options and must answer a battery of questions related to it within 60 seconds. For each question, the host provides two options. If the contestant guesses correctly, they win 20 points; otherwise, they move on to the next question (as the correct answer would be the other option). If the time runs out before the question is fully asked and both possible answers are provided, the contestant may still answer it; however, if the statement hasn't been completed (or the options weren't provided), they cannot answer.",
      foto: "../gameImg/foto0.png"
    },
    {
      nombre: "Warm Question",
      description: "It consists of topics of varied themes. For each correct answer, 100 points are earned, and 10 points are lost if the contestant passes, does not respond, or answers incorrectly.",
      foto: "../gameImg/foto1.jpg"
    },
    {
      nombre: "Discovering Cities",
      description: "In the 'Discovering Cities' game mode, the contestant will face a challenge where they will be repeatedly asked questions referring to different cities around the world. To successfully overcome the challenge, the contestant must answer as many questions as possible correctly throughout the test.",
      foto: "../gameImg/foto2.png"
    },
    {
      nombre: "Challenge",
      description: "The 'Challenge' game mode is the quintessential game mode, as it allows you to customize the match to your liking. This game mode is tailored for those who wish to practice certain game formats before engaging in our various other game modes.",
      foto: "../gameImg/foto3.jpg"
    },
    {
      nombre: "Multiplayer",
      description: "Create a room for other players to join and play together. Also, a chat is available.",
      foto: "../gameImg/foto3.jpg"
    }
  ]
}));

describe('Instructions component', () => {
  it('renders initial UI elements', () => {
    render(
      <Router>
        <Instructions />
      </Router>
    );

    expect(screen.getByText('INSTRUCTIONS')).toBeInTheDocument(); //Check that the title is there
    expect(screen.getAllByRole('button').length).toBe(5); // Assuming there are 5 games in your mocked data, check that the buttons are there.
  });

  it('Displays game information when a game button is clicked', async () => {
    render(
      <Router>
        <Instructions />
      </Router>
    );

    fireEvent.click(screen.getAllByRole('button')[0]); // Click the first game button

    const gameNames = await screen.findAllByText("Wise Men Stack"); //Look for the text "WISE MEN STACK"
    expect(gameNames).toHaveLength(2); // Check the expected number of matches

    expect(gameNames[0]).toHaveTextContent("Wise Men Stack");
  });

  it('Hides game information when the same game button is clicked again', async () => {
    render(
      <Router>
        <Instructions />
      </Router>
    );

    const gameButton = screen.getAllByRole('button')[0]; //Selecciona el primer boton
    fireEvent.click(gameButton); // Hace click en el boton indicado

    const gameNames = await screen.findAllByText("Wise Men Stack"); //Finds all components that have the indicated text
    expect(gameNames).toHaveLength(2); // Check the expected number of matches

    fireEvent.click(gameButton); // Hide info

    const gameNames2 = await screen.findAllByText("Wise Men Stack"); //Finds all components that have the indicated text
    expect(gameNames2).toHaveLength(1); // Check the expected number of matches

    await waitFor(() => {
      expect(screen.queryByText(/The player chooses a topic from five available options/)).not.toBeInTheDocument();
    });
  });

  it('Switches displayed information when a different game button is clicked', async () => {
    render(
      <Router>
        <Instructions />
      </Router>
    );

    fireEvent.click(screen.getAllByRole('button')[0]); // Display first game info

    const gameNames = await screen.findAllByText("Wise Men Stack"); //Finds all components that have the indicated text
    expect(gameNames).toHaveLength(2); // Check the expected number of matches

    fireEvent.click(screen.getAllByRole('button')[1]); // Switch to second game info

    const gameName = await screen.findAllByText("Warm Question");  //Finds all components that have the indicated text
    expect(gameName).toHaveLength(2); // Check the expected number of matches

    await waitFor(() => {
      const gameDescription = screen.getByText(/It consists of ten topics of varied themes/);
      expect(gameDescription).toBeInTheDocument();
    });
  });

  const mockGameData = [
    {
      nombre: "Wise Men Stack",
      description: "The player chooses a topic from some available options and must answer a battery of questions related to it within 60 seconds. For each question, the host provides two options. If the contestant guesses correctly, they win 20 points; otherwise, they move on to the next question (as the correct answer would be the other option). If the time runs out before the question is fully asked and both possible answers are provided, the contestant may still answer it; however, if the statement hasn't been completed (or the options weren't provided), they cannot answer.",
      foto: "../gameImg/foto0.png"
    },
    {
      nombre: "Warm Question",
      description: "It consists of topics of varied themes. For each correct answer, 100 points are earned, and 10 points are lost if the contestant passes, does not respond, or answers incorrectly.",
      foto: "../gameImg/foto1.jpg"
    },
    {
      nombre: "Discovering Cities",
      description: "In the 'Discovering Cities' game mode, the contestant will face a challenge where they will be repeatedly asked questions referring to different cities around the world. To successfully overcome the challenge, the contestant must answer as many questions as possible correctly throughout the test.",
      foto: "../gameImg/foto2.png"
    },
    {
      nombre: "Challenge",
      description: "The 'Challenge' game mode is the quintessential game mode, as it allows you to customize the match to your liking. This game mode is tailored for those who wish to practice certain game formats before engaging in our various other game modes.",
      foto: "../gameImg/foto3.jpg"
    },
    {
      nombre: "Multiplayer",
      description: "Create a room for other players to join and play together. Also, a chat is available.",
      foto: "../gameImg/foto3.jpg"
    }
  ];

  mockGameData.forEach((game, index) => {
    it(`Displays information for ${game.nombre} when its button is clicked`, async () => {
      render(<Router><Instructions /></Router>);

      // Click in the game button
      fireEvent.click(screen.getAllByRole('button')[index]);

      console.log(game.descripcion);
      // Verify that the game name and description are in the document
      const gameName = await screen.findAllByText(game.nombre);
      expect(gameName).toHaveLength(2); // Check the expected number of matches

      const gameDescription = await screen.findByText(game.descripcion);
      expect(gameDescription).toBeInTheDocument();
    });
  });

});
