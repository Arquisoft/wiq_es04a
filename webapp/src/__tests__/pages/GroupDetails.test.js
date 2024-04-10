import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GroupDetails from '../../pages/GroupDetails';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
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
    };

    // Mock useParams to return the group name
    useParams.mockReturnValue({ groupName });

    mockAxios.onGet(`http://localhost:8000/group/${groupName}`).reply(200, groupInfo);

    const { getByText } = render(
      <Router>
          <GroupDetails />
      </Router>
    );

    await waitFor(() => {
      expect(getByText(groupInfo.name)).toBeInTheDocument();
      expect(getByText(`Creator: ${groupInfo.creator}`)).toBeInTheDocument();
      expect(getByText(`Created in: ${new Date(groupInfo.createdAt).toLocaleDateString()}`)).toBeInTheDocument();
      expect(getByText(`Members ${groupInfo.users.length}/20:`)).toBeInTheDocument();
      groupInfo.users.forEach(user => {
        expect(getByText(user)).toBeInTheDocument();
      });
    });
  });

  it('should render error message when failed to fetch group information', async () => {
    // Mock useParams to return the group name
    useParams.mockReturnValue({ groupName: 'NonExistentGroup' });

    mockAxios.onGet(`http://localhost:8000/group/NonExistentGroup`).reply(404);

    const { getByText } = render(
      <Router>
          <GroupDetails />
      </Router>
    );

    await waitFor(() => {
      expect(getByText('Error fetching group information')).toBeInTheDocument();
    });
  });
});
