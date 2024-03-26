import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider, Box } from '@mui/material';

import { SessionContext } from '../SessionContext';
import { useContext } from 'react';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const [userStatics, setUserStatics] = useState([]);
    const {username} = useContext(SessionContext);

    useEffect(() => {
        const fetchUserStatics = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/statistics/${username}`);
                setUserStatics(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserStatics();
    }, []);

    return (
        <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant="h3" align="center" gutterBottom>
                Statistics
            </Typography>
            <Box>
                <Typography variant="h5" align="center" gutterBottom>
                    Classic Game
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, margin: 'auto' }}>
                    <Divider style={{ marginTop:'3%'}}/>
                    <ListItem>
                        <ListItemText primary={`Earned Money: ${userStatics.earned_money}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Correctly Answered Questions: ${userStatics.classic_correctly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Incorrectly Answered Questions: ${userStatics.classic_incorrectly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Total Time Played: ${userStatics.classic_total_time_played}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Games Played: ${userStatics.classic_games_played}`} />
                    </ListItem>
                    <Divider style={{ marginTop:'3%'}}/>
                </List>
            </Box>
        </Container>
    );
};

export default Statistics;