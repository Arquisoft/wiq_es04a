import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Stack, Typography } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/group/list`);
            setGroups(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
    }, []);

    return (
    <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h3">GROUPS</Typography>
      <Stack spacing={2}>
        <Typography>Prueba</Typography>
      {groups.map(group => (
          // Need to revise the JSON format when integrating back and frontend
          <Typography key={group.id}>{group.name}</Typography>
      ))}
      </Stack>
    </Container>
    );

}

export default GroupList;