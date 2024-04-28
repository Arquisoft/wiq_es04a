import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GroupDetails from '../../pages/GroupDetails';
import '../../localize/i18n';
import { SessionContext } from '../../SessionContext';

const mockAxios = new MockAdapter(axios);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ groupName: 'TestGroup' }),
}));

describe('GroupDetails component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render group information', async () => {
    // Mock group data
    const groupName = 'TestGroup';
    const groupInfo = {
      name: groupName,
      creator: 'TestCreator',
      createdAt: new Date().toISOString(),
      users: ['User 1', 'User 2'],
      show: true, // Assuming this property is always present in the data
    };

    mockAxios.onGet(`http://localhost:8000/group/${groupName}`).reply(200, groupInfo);

    const { getByText } = render(
      <SessionContext.Provider value={{ username: 'TestCreator' }}>
        <Router>
          <GroupDetails />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
      expect(getByText(groupInfo.name)).toBeInTheDocument();
      expect(getByText(`${groupInfo.creator}`)).toBeInTheDocument();
      expect(getByText(`${new Date(groupInfo.createdAt).toLocaleDateString()}`)).toBeInTheDocument();
      expect(getByText(`${groupInfo.users.length}/20`)).toBeInTheDocument();
      groupInfo.users.forEach(user => {
        expect(getByText(user)).toBeInTheDocument();
      });
    });
  });

  it('debe reproducir el video a una velocidad de 0.85', async () => {
    render(
      <SessionContext.Provider value={{ username: 'TestCreator' }}>
        <Router>
          <GroupDetails />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
      const videoElement = screen.getByTestId('video');
      expect(videoElement).toBeInTheDocument();
      expect(videoElement.playbackRate).toBe(0.85);
    });

  });

  it('should render error message when failed to fetch group information', async () => {

    mockAxios.onGet(`http://localhost:8000/group/NonExistentGroup`).reply(404);

    const { getByText } = render(
      <SessionContext.Provider value={{ username: 'TestCreator' }}>
        <Router>
          <GroupDetails />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
      expect(getByText('Error fetching group information')).toBeInTheDocument();
    });
  });
});
