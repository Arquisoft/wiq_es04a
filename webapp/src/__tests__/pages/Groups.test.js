import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Groups from '../../pages/Groups';

const mockAxios = new MockAdapter(axios);

describe('Groups component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render groups list and creation elements', async () => {
    // It mocks a succesful request getting two groups from the database.
    mockAxios.onGet('http://localhost:8000/group/list').reply(200, { groups: [{ name: 'Group 1' }, { name: 'Group 2' }] });

    // It simulates the groups page when entering it
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    // It expects the static elements to be shown on the page
    expect(screen.getByText('GROUPS')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('should show an error message fetching data', async () => {
    // It simulates a request with an error fetching data
    mockAxios.onGet('http://localhost:8000/group/list').reply(500);
  
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    // It expects to see the error
    await waitFor(() => {
      expect(screen.getByText('Error: Unsuccesful data fetching')).toBeInTheDocument();
    });
  });

  it('should successfully add a group', async () => {
    // It simulates a succesful group add request
    mockAxios.onPost('http://localhost:8000/group/add').reply(200);
  
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    // It introduces a new group in the text field
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Group' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  
    // It waits for the succesful message to be shown
    await waitFor(() => {
      expect(screen.getByText('Group created successfully')).toBeInTheDocument();
    });
  });

  it('should show an error when another group with the same name exists', async () => {
    mockAxios.onPost('http://localhost:8000/group/add').reply(400, { error: 'A group with the same name already exists.' });
  
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    // Simulates the addition of a group with the same name as an existing one.
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Existing Group' } });
  
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  
    // Waits for the error message to be shown
    await waitFor(() => {
      expect(screen.getByText('Error: A group with the same name already exists.')).toBeInTheDocument();
    });
  });

});