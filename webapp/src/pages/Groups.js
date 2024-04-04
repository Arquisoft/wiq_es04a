import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, Divider, Snackbar, TextField, Grid, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Groups = () => {

    const [name, setName] = useState('');
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);

    // Pagination managing function
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const indexOfLastItem = page * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);

    const { username } = useContext(SessionContext);

    const fetchData = useCallback(async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/user/group/list`, { params: { username: username } });
        setGroups(response.data.groups);
      } catch (error) {
        setError('Unsuccesful data fetching');
      }
    }, [username]);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // Function that creates a group and shows the posible errors
    const addGroup = async () => {
      try {
        await axios.post(`${apiEndpoint}/group/add`, {
          name:name,
          username:username
        });
        setOpenSnackbar(true);
        fetchData();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError('A group with the same name already exists.');
        } else {
          setError(error.response.data.error);
        }
      }
    };

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };

    // Function that makes the user join a group and shows the possible erros when making this
    const addToGroup = async (name) => {
      try {
        await axios.post(`${apiEndpoint}/group/`+name+`/join`, { username });
        setOpenSnackbar(true);
        fetchData();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError('Group is already full');
        } else {
          setError(error.response.data.error);
        }
      }
    };

    const navigate = useNavigate();

    // Function that changes the page to the group details one
    const seeMembers = (groupName) => {
      navigate(`/group/${groupName}`);
    };

    return (
    <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" sx={{ width: '100%', textAlign: 'center' }}>GROUPS</Typography>

      {/* Container showing the group creation field and button */}
      <Container>
        <Typography component="h1" variant="h5">Create</Typography>
        <Divider style={{ marginBottom:'0.5em'}}/>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField name="name" value={name} label="Name" fullWidth onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={addGroup} sx={{ padding:'1.1em' }} fullWidth>
              Create
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={4500} onClose={handleCloseSnackbar} message="Group created successfully" />
        {error && (<Snackbar open={!!error} autoHideDuration={4500} onClose={() => setError('')} message={`Error: ${error}`} />)}
      </Container> 

      {/* Container showing the paginated groups list and its items */}
      <Container sx={{ marginTop:'2em' }}>
        <Typography component="h1" variant="h5">List</Typography>  
        <Divider style={{ marginBottom:'0.5em'}}/>
        <List sx={{ margin:'0', width: '100%' }}>
          {currentItems.map((group) => (
            <Container key={group.name+"_container"}>
              <ListItem key={group.name} sx={{ display:'flex', alignContent:'space-between', alignItems:'center' }}>
                <ListItemText primary={group.name} />
                <Button variant="contained" color="primary" sx={{ marginRight: '2em' }} onClick={() => seeMembers(group.name)}>
                  See Members
                </Button>
                {group.isMember ? (
                  <Button variant="contained" sx={{ backgroundColor:'#ffffff', color:'#006699', borderColor:'#006699', '&:hover': { backgroundColor: '#ffffff' } }}>
                    JOINED
                  </Button>
                ) : group.isFull ? (
                  <Button variant="contained" sx={{ backgroundColor:'#ffffff', color:'#FF0000', borderColor:'#FF0000', '&:hover': { backgroundColor: '#ffffff' } }}>
                    FILLED
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => addToGroup(group.name)}>
                    JOIN IT!
                  </Button>
                )}
                <Snackbar open={openSnackbar} autoHideDuration={4500} onClose={handleCloseSnackbar} message="Joined the group successfully" />
                {error && (<Snackbar open={!!error} autoHideDuration={4500} onClose={() => setError('')} message={`Error: ${error}`} />)}
              </ListItem>
              <Divider/>
            </Container>
          ))}
        </List>
        <Pagination
          count={Math.ceil(groups.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          boundaryCount={1}
          siblingCount={1}
          sx={{ '& ul': { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.5em' }}}
        />
      </Container>
    </Container>
    );

}

export default Groups;