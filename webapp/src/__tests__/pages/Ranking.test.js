import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Ranking from '../../pages/Ranking';

jest.mock('axios');

describe('Ranking Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  it('should show user ranking when "USERS" button is clicked', async () => {
    const userRanking = {
      data: { rank: [
        { id: 'User1', totalMoney: 500, totalCorrectAnswers: 30, totalIncorrectAnswers: 5, totalGamesPlayed: 10 },
        { id: 'User2', totalMoney: 450, totalCorrectAnswers: 25, totalIncorrectAnswers: 10, totalGamesPlayed: 9 }
      ]}
    };
    axios.get.mockResolvedValueOnce(userRanking);

    render(<Ranking />);
    const usersButton = screen.getByTestId('users-button');
    fireEvent.click(usersButton);

    setTimeout(() => {
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    }, 15);

  });

  it('should display group ranking when "GROUPS" button is clicked', async () => {
    const groupRanking = {
      data: { rank: [
        { id: 'Group1', totalMoney: 1000, totalCorrectAnswers: 60, totalIncorrectAnswers: 10, totalGamesPlayed: 20 },
        { id: 'Group2', totalMoney: 900, totalCorrectAnswers: 50, totalIncorrectAnswers: 20, totalGamesPlayed: 18 }
      ]}
    };
    axios.get.mockResolvedValueOnce(groupRanking);

    render(<Ranking />);
    const groupsButton = screen.getByTestId('groups-button');
    fireEvent.click(groupsButton);

    setTimeout(() => {
      expect(screen.getByText('Group1')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    }, 15);
  });
  
});
