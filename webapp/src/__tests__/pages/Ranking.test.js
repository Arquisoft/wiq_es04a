import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Ranking from '../../pages/Ranking.js';

jest.mock('axios');

it('fetches ranking from an API and displays them', async () => {
  const ranking = [
    { username: 'User1', totalScore: 100 },
    { username: 'User2', totalScore: 90 },
    // Add more users if needed
  ];

  axios.get.mockResolvedValueOnce({ data: { rank: ranking } });

  render(<Ranking />);

  const listItemElements = await screen.findAllByRole('listitem');

  expect(listItemElements).toHaveLength(ranking.length);

  listItemElements.forEach((listItemElement, index) => {
    expect(listItemElement).toHaveTextContent(`${ranking[index].username.toUpperCase()}: ${ranking[index].totalScore}`);
  });
});


