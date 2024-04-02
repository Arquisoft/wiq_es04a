import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Instructions from '../../pages/Instructions';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../data/gameInfo.json', () => ({
  __esModule: true,
  default: [
    {
      nombre: "WISE MEN STACK",
      descripcion: "The player chooses a topic from five available options and must answer a battery of questions related to it within 60 seconds. For each question, the host provides two options. If the contestant guesses correctly, they win €20; otherwise, they move on to the next question (as the correct answer would be the other option). If the time runs out before the question is fully asked and both possible answers are provided, the contestant may still answer it; however, if the statement hasn't been completed (or the options weren't provided), they cannot answer.",
      foto: "../gameImg/foto0.png"
    },
    {
      nombre: "WARM QUESTION",
      descripcion: "It consists of ten topics of varied themes. For each correct answer, €100 is earned, and €10 are lost if the contestant passes, does not respond, or answers incorrectly.",
      foto: "../gameImg/foto1.jpg"
    },
    {
      nombre: "DISCOVERING CITIES",
      descripcion: "In the 'Discovering Cities' game mode, the contestant will face a challenge where they will be repeatedly asked questions referring to different cities around the world. To successfully overcome the challenge, the contestant must answer as many questions as possible correctly throughout the test.",
      foto: "../gameImg/foto2.png"
    },
    {
      nombre: "THE CHALLENGE",
      descripcion: "The 'Challenge' game mode is the quintessential game mode, as it allows you to customize the match to your liking. This game mode is tailored for those who wish to practice certain game formats before engaging in our various other game modes.",
      foto: "../gameImg/foto3.jpg"
    },
    {
      nombre: "ONLINE MODE",
      descripcion: "Create a room for other player to join and play 1vs1",
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

    expect(screen.getByText('GAME MODES')).toBeInTheDocument(); //Check that the title is there
    expect(screen.getAllByRole('button').length).toBe(5); // Assuming there are 5 games in your mocked data, check that the buttons are there.
  });

  it('Displays game information when a game button is clicked', async () => {
    render(
      <Router>
        <Instructions />
      </Router>
    );

    fireEvent.click(screen.getAllByRole('button')[0]); // Click the first game button

    const gameNames = await screen.findAllByText("WISE MEN STACK"); //Look for the text "WISE MEN STACK"
    expect(gameNames).toHaveLength(2); // Check the expected number of matches

    expect(gameNames[0]).toHaveTextContent("WISE MEN STACK");
  });

  it('Hides game information when the same game button is clicked again', async () => {
    render(
      <Router>
        <Instructions />
      </Router>
    );

    const gameButton = screen.getAllByRole('button')[0]; //Selecciona el primer boton
    fireEvent.click(gameButton); // Hace click en el boton indicado

    const gameNames = await screen.findAllByText("WISE MEN STACK"); //Finds all components that have the indicated text
    expect(gameNames).toHaveLength(2); // Check the expected number of matches

    fireEvent.click(gameButton); // Hide info

    const gameNames2 = await screen.findAllByText("WISE MEN STACK"); //Finds all components that have the indicated text
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

    const gameNames = await screen.findAllByText("WISE MEN STACK"); //Finds all components that have the indicated text
    expect(gameNames).toHaveLength(2); // Check the expected number of matches

    fireEvent.click(screen.getAllByRole('button')[1]); // Switch to second game info

    const gameName = await screen.findAllByText("WARM QUESTION");  //Finds all components that have the indicated text
    expect(gameName).toHaveLength(2); // Check the expected number of matches

    await waitFor(() => {
      const gameDescription = screen.getByText(/It consists of ten topics of varied themes/);
      expect(gameDescription).toBeInTheDocument();
    });
  });

  const mockGameData = [
    {
      nombre: "WISE MEN STACK",
      descripcion: "The player chooses a topic from five available options and must answer a battery of questions related to it within 60 seconds. For each question, the host provides two options. If the contestant guesses correctly, they win €20; otherwise, they move on to the next question (as the correct answer would be the other option). If the time runs out before the question is fully asked and both possible answers are provided, the contestant may still answer it; however, if the statement hasn't been completed (or the options weren't provided), they cannot answer.",
      foto: "../gameImg/foto0.png"
    },
    {
      nombre: "WARM QUESTION",
      descripcion: "It consists of ten topics of varied themes. For each correct answer, €100 is earned, and €10 are lost if the contestant passes, does not respond, or answers incorrectly.",
      foto: "../gameImg/foto1.jpg"
    },
    {
      nombre: "DISCOVERING CITIES",
      descripcion: "In the 'Discovering Cities' game mode, the contestant will face a challenge where they will be repeatedly asked questions referring to different cities around the world. To successfully overcome the challenge, the contestant must answer as many questions as possible correctly throughout the test.",
      foto: "../gameImg/foto2.png"
    },
    {
      nombre: "THE CHALLENGE",
      descripcion: "The 'Challenge' game mode is the quintessential game mode, as it allows you to customize the match to your liking. This game mode is tailored for those who wish to practice certain game formats before engaging in our various other game modes.",
      foto: "../gameImg/foto3.jpg"
    },
    {
      nombre: "ONLINE MODE",
      descripcion: "Create a room for other player to join and play 1vs1",
      foto: "../gameImg/foto3.jpg"
    }
  ];

  mockGameData.forEach((game, index) => {
    it(`Displays information for ${game.nombre} when its button is clicked`, async () => {
      render(<Router><Instructions /></Router>);

      // Haz clic en el botón del juego
      fireEvent.click(screen.getAllByRole('button')[index]);

      // Verifica que el nombre y la descripción del juego estén en el documento
      const gameName = await screen.findAllByText(game.nombre);
      expect(gameName).toHaveLength(2); // Check the expected number of matches

      const gameDescription = await screen.findByText(game.descripcion);
      expect(gameDescription).toBeInTheDocument();
    });
  });
});
