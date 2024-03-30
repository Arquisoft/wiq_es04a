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
                <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px'}}>
                    The Challenge
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, margin: 'auto' }}>
                    <Divider style={{ marginTop:'3%'}}/>
                    <ListItem>
                        <ListItemText primary={`Earned Money: ${userStatics.the_callenge_earned_money}€`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Correctly Answered Questions: ${userStatics.the_callenge_correctly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Incorrectly Answered Questions: ${userStatics.the_callenge_incorrectly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Total Time Played: ${userStatics.the_callenge_total_time_played}''`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Games Played: ${userStatics.the_callenge_games_played}`} />
                    </ListItem>
                </List>
                <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px'}}>
                    Wise Men Stack
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, margin: 'auto' }}>
                    <Divider style={{ marginTop:'3%'}}/>
                    <ListItem>
                        <ListItemText primary={`Earned Money: ${userStatics.wise_men_stack_earned_money}€`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Correctly Answered Questions: ${userStatics.wise_men_stack_correctly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Incorrectly Answered Questions: ${userStatics.wise_men_stack_incorrectly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Games Played: ${userStatics.wise_men_stack_games_played}`} />
                    </ListItem>
                </List>
                <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px'}}>
                    Warm Question
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, margin: 'auto' }}>
                    <Divider style={{ marginTop:'3%'}}/>
                    <ListItem>
                        <ListItemText primary={`Earned Money: ${userStatics.warm_question_earned_money}€`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Correctly Answered Questions: ${userStatics.warm_question_correctly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Incorrectly Answered Questions: ${userStatics.warm_question_incorrectly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Passed Questions: ${userStatics.warm_question_passed_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Games Played: ${userStatics.warm_question_games_played}`} />
                    </ListItem>
                </List>
                <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px'}}>
                    Discovering Cities
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, margin: 'auto' }}>
                    <Divider style={{ marginTop:'3%'}}/>
                    <ListItem>
                        <ListItemText primary={`Earned Money: ${userStatics.discovering_cities_earned_money}€`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Correctly Answered Cities: ${userStatics.discovering_cities_correctly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Incorrectly Answered Cities: ${userStatics.discovering_cities_incorrectly_answered_questions}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Games Played: ${userStatics.discovering_cities_games_played}`} />
                    </ListItem>
                </List>
            </Box>
        </Container>
    );
};

export default Statistics;