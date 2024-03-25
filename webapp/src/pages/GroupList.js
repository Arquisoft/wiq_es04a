import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, Divider, Box, Snackbar } from '@mui/material';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const GroupList = () => {

    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const { username } = useContext(SessionContext);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/group/list`,{params: {username: username }});
            setGroups(response.data.groups);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
    }, []);

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };

    const addToGroup = async (name) => {
      try {
        await axios.post(`${apiEndpoint}/group/`+name+`/join`, { username });
        setOpenSnackbar(true);
        // TODO
        // fetchData();
      } catch (error) {
        setError(error.response.data.error);
      }
    };

    return (
    <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h3">GROUPS</Typography>
      <List sx={{ margin:'0' }}>
        {groups.map((group) => (
          <Box>
            <ListItem key={group.name} sx={{ display:'flex', alignContent:'space-between', margin:'0'}}>
              <ListItemText primary={group.name} />
              {group.isMember ? (
                <Button variant="contained" sx={{ backgroundColor:'#ffffff', color:'#006699', borderColor:'#006699' }}>
                  Ya eres miembro
                </Button>
              ):(
                <Button variant="contained" color="primary" onClick={() => addToGroup(group.name)}>
                  Unirse
                </Button>
              )}
              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Joined the group successfully" />
              {error && (<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />)}
            </ListItem>
            <Divider style={{ marginTop:'3%'}}/>
          </Box>
        ))}
      </List>
    </Container>
    );

}

export default GroupList;