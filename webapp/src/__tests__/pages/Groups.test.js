import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
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
    mockAxios.onGet('http://localhost:8000/user/group/list').reply(200, { groups: [{ name: 'Group 1' }, { name: 'Group 2' }] });

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
    mockAxios.onGet('http://localhost:8000/user/group/list').reply(500);
  
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

    setTimeout(() => {
      // Verify that the error snackbar is closed
      expect(screen.queryByText('Group created successfully')).toBeNull();
    }, 4800);
  });

  it('should show an error when another group with the same name exists', async () => {
    // Mocks a request error code with an already existing group
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

  it('should show generic error when adding a group fails', async () => {
    // Mocks a request generic error code
    mockAxios.onPost('http://localhost:8000/group/add').reply(500, { error: 'Internal Server Error' });
  
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    // Introduces a new group
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Group' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  
    // Waits for the error message to be shown
    await waitFor(() => {
      expect(screen.getByText('Error: Internal Server Error')).toBeInTheDocument();
    });
  });

  it('should show the FILLED button when group is already full', async () => {
    // Simulates a request response including the full group data
    mockAxios.onGet('http://localhost:8000/user/group/list').reply(200, { groups: [{ name: 'Group 1', isMember: false, isFull: true }] });
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct FILLED button
    await waitFor(() => {
      expect(screen.getByText('See Members')).toBeInTheDocument();
      expect(screen.getByText('FILLED')).toBeInTheDocument();
    });

  });

  it('should show the JOINED button when user has joined the group', async () => {
    // Simulates a request response including the joined group data
    mockAxios.onGet('http://localhost:8000/user/group/list').reply(200, { groups: [{ name: 'Group 1', isMember: true, isFull: false }] });
  
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct JOINED button
    await waitFor(() => {
      expect(screen.getByText('See Members')).toBeInTheDocument();
      expect(screen.getByText('JOINED')).toBeInTheDocument();
    });

  });  

  it('could see group details', async () => {
    // Simulates a request response including the joined group data
    mockAxios.onGet('http://localhost:8000/user/group/list').reply(200, { groups: [{ name: 'Group 1', isMember: false, isFull: false }] });
  
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct JOIN IT! and See Members button
    await waitFor(() => {
      expect(screen.getByText('See Members')).toBeInTheDocument();
      expect(screen.getByText('JOIN IT!')).toBeInTheDocument();
    });

    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'See Members' }));
      await waitFor(() => {
        expect(mockAxios.history.get.length).toBe(1); // Ensure that the join request is made
      });
    });

  });

  it('should change the page when pagination is clicked', async () => {
    // Simulates a request response including a list of groups with more than five items
    const mockedGroups = Array.from({ length: 10 }, (_, index) => ({ name: `Group ${index + 1}`, isMember: false, isFull: false }));
    mockAxios.onGet('http://localhost:8000/user/group/list').reply(200, { groups: mockedGroups });
    
    render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
    
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
    
    // Expect the groups of the first page
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.queryByText('Group 6')).toBeNull();
    });
  
    // Pagination element
    const paginationElement = screen.getByRole('navigation');
  
    // Click the second page
    fireEvent.click(screen.getByText('2'));
  
    // Expect the page to have changed
    await waitFor(() => {
      expect(screen.getByText('Group 6')).toBeInTheDocument();
      expect(screen.queryByText('Group 1')).toBeNull();
    });
  });

  it('should display and close the error snackbar when an error occurs', async () => {
    // It simulates a succesful group add request
    mockAxios.onPost('http://localhost:8000/group/add').reply(400, { error: 'A group with the same name already exists.' });

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
      expect(screen.getByText('Error: A group with the same name already exists.')).toBeInTheDocument();
    });
  
    setTimeout(() => {
      // Verify that the error snackbar is closed
      expect(screen.queryByText('Error: A group with the same name already exists.')).toBeNull();
    }, 4800);
  });

});