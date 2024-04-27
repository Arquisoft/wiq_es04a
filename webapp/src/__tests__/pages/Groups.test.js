import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { SessionContext } from '../../SessionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Groups from '../../pages/Groups';
import '../../localize/i18n';

const mockAxios = new MockAdapter(axios);

describe('Groups component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  const renderGroupsComponent = () => {
    return render(
      <SessionContext.Provider value={{}}>
        <Router>
          <Groups />
        </Router>
      </SessionContext.Provider>
    );
  };

  const checkButtons = async (text) => {
    await waitFor(() => {
      expect(screen.getByText('See Members')).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  };

  it('debe reproducir el video a una velocidad de 0.85', async () => {
    renderGroupsComponent();
    const videoElement = screen.getByTestId('video');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.playbackRate).toBe(0.85);

  });

  it('should render groups list and creation elements', async () => {
    // It mocks a succesful request getting two groups from the database.
    mockAxios.onGet('http://localhost:8000/group').reply(200, { groups: [{ name: 'Group 1' }, { name: 'Group 2' }] });
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group 1' }, { name: 'Group 2' }] });

    renderGroupsComponent();

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

  it('should show the FILLED button when group is already full', async () => {
    // Simulates a request response including the full group data
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group 1', isMember: false, isFull: true }] });
    
    renderGroupsComponent();
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct FILLED button
    await checkButtons('FILLED');

  });

  it('should show the DELETE button when user is the creator', async () => {
    // Simulates a request response including the full group data
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group 1', isMember: true, isCreator: true, isFull: false }] });
    
    renderGroupsComponent();
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct DELETE button
    await checkButtons('DELETE');

  });

  it('could see group details', async () => {
    // Simulates a request response including the joined group data
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group 1', isMember: false, isFull: false }] });
  
    renderGroupsComponent();
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct JOIN IT! and See Members button
    await checkButtons('JOIN IT!');

    
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
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: mockedGroups });
    
    renderGroupsComponent();
    
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
    
    // Expect the groups of the first page
    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.queryByText('Group 6')).toBeNull();
    });
  
    // Click the second page
    fireEvent.click(screen.getByText('2'));
  
    // Expect the page to have changed
    await waitFor(() => {
      expect(screen.getByText('Group 6')).toBeInTheDocument();
      expect(screen.queryByText('Group 1')).toBeNull();
    });
  });

  it('should successfully add user to a group', async () => {
    // Simulates a request response including the unjoined group data
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group1', isMember: false, isFull: false }] });
    mockAxios.onPut('http://localhost:8000/group/Group1').reply(200);
  
    renderGroupsComponent();
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct JOIN IT! and See Members button
    await checkButtons('JOIN IT!');
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'JOIN IT!' }));
    });

    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(2); // Ensure that the new join request is made
      expect(screen.getByText('Joined the group successfully')).toBeInTheDocument();
    });

  });


  // FROM HERE, LOW TIMEOUTS NEED TO BE USED INSTEAD OF WAITFORS
 
  it('should display error message when group is already full', async () => {
    // Simulates a request response including the unjoined group data
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group1', isMember: false, isCreator: false , isFull: false }] });
    mockAxios.onPut('http://localhost:8000/group/Group1').reply(400, { error: 'Group is already full' });
  
    renderGroupsComponent();
  
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    });
  
    // We expect to have the correct JOIN IT! and See Members button
    await checkButtons('JOIN IT!');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'JOIN IT!' }));
      // Wait for the error message to appear
      setTimeout(() => {
        // Verify that the error snackbar is showing the error
        expect(screen.getByText('Error: Group is already full')).toBeInTheDocument();
      }, 15);
    });
 
  });

  it('should show an error message fetching data', async () => {
    // It simulates a request with an error fetching data
    mockAxios.onGet('http://localhost:8000/user/group').reply(500);
  
    renderGroupsComponent();
  
    // It expects to see the error
    setTimeout(() => {
      expect(screen.getByText('Error: Group is already full')).toBeInTheDocument();
    }, 15);
  });

  it('should successfully add a group', async () => {
    // It simulates a succesful group add request
    mockAxios.onPost('http://localhost:8000/group').reply(200);
  
    renderGroupsComponent();
  
    // It introduces a new group in the text field
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Group' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  
    // It waits for the succesful message to be shown
    setTimeout(() => {
      expect(screen.queryByText('Group created successfully')).toBeInTheDocument();
    }, 15);
  });

  it('should show an error when another group with the same name exists', async () => {
    // Mocks a request error code with an already existing group
    mockAxios.onPost('http://localhost:8000/group').reply(400, { error: 'A group with the same name already exists.' });
  
    renderGroupsComponent();
  
    // Simulates the addition of a group with the same name as an existing one.
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Existing Group' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  
    // Waits for the error message to be shown
    setTimeout(() => {
      expect(screen.getByText('Error: A group with the same name already exists.')).toBeInTheDocument();
    }, 15);
  });

  it('should show generic error when adding a group fails', async () => {
    // Mocks a request generic error code
    mockAxios.onPost('http://localhost:8000/group').reply(500, { error: 'Internal Server Error' });
  
    renderGroupsComponent();
  
    // Introduces a new group
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Group' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  
    // Waits for the error message to be shown
    setTimeout(() => {
      expect(screen.getByText('Error: Internal Server Error')).toBeInTheDocument();
    }, 15);
  });

  it('should show the JOINED button when user has joined the group', async () => {
    // Simulates a request response including the joined group data
    mockAxios.onGet('http://localhost:8000/user/group').reply(200, { groups: [{ name: 'Group 1', isMember: true, isFull: false }] });
  
    renderGroupsComponent();
  
    setTimeout(() => {
      expect(mockAxios.history.get.length).toBe(1); // We wait till the new request is done and confirmed
    }, 15);
  
    // We expect to have the correct JOINED button
    setTimeout(() => {
      checkButtons('JOINED');
    }, 15);

  });  

   it('should display and close the error snackbar when an error occurs', async () => {
    // It simulates a succesful group add request
    mockAxios.onPost('http://localhost:8000/group').reply(400, { error: 'A group with the same name already exists.' });

    renderGroupsComponent();

    // It introduces a new group in the text field
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Group' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    // It waits for the succesful message to be shown
    setTimeout(() => {
      expect(screen.getByText('Error: A group with the same name already exists.')).toBeInTheDocument();
    }, 15);
  });

});  