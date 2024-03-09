import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, Divider, Box } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/group/list`);
            console.log(response.data.groups);
            setGroups(response.data.groups);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
    }, []);

    return (
    <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h3">GROUPS</Typography>

      <List sx={{ margin:'0' }}>
        {groups.map((group) => (
          <Box>
            <ListItem key={group.name} sx={{ display:'flex', alignContent:'space-between', margin:'0'}}>
              <ListItemText primary={group.name} />
              <Button variant="contained" color="primary">
                Unirse
              </Button>
            </ListItem>
            <Divider style={{ marginTop:'3%'}}/>
          </Box>
        ))}
      </List>
    </Container>
    );

}

export default GroupList;