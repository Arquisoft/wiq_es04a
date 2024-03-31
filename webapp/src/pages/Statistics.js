import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

import { SessionContext } from '../SessionContext';
import { useContext } from 'react';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const [userStatics, setUserStatics] = useState([]);
    const [selectedMode, setSelectedMode] = useState('The Challenge'); 
    const { username } = useContext(SessionContext);

    useEffect(() => {
        const fetchUserStatics = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/user/statistics/${username}`);
                setUserStatics(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserStatics();
    }, [username]);

    const renderStatistics = () => {
        switch (selectedMode) {
            case 'The Challenge':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="The Challenge Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{userStatics.the_callenge_earned_money}€</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Questions:</TableCell>
                                    <TableCell>{userStatics.the_callenge_correctly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Questions:</TableCell>
                                    <TableCell>{userStatics.the_callenge_incorrectly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Time Played:</TableCell>
                                    <TableCell>{userStatics.the_callenge_total_time_played}''</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{userStatics.the_callenge_games_played}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'Wise Men Stack':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="Wise Men Stack Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{userStatics.wise_men_stack_earned_money}€</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Questions:</TableCell>
                                    <TableCell>{userStatics.wise_men_stack_correctly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Questions:</TableCell>
                                    <TableCell>{userStatics.wise_men_stack_incorrectly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{userStatics.wise_men_stack_games_played}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'Warm Question':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="Warm Question Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{userStatics.warm_question_earned_money}€</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Questions:</TableCell>
                                    <TableCell>{userStatics.warm_question_correctly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Questions:</TableCell>
                                    <TableCell>{userStatics.warm_question_incorrectly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Passed Questions:</TableCell>
                                    <TableCell>{userStatics.warm_question_passed_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{userStatics.warm_question_games_played}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'Discovering Cities':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="Discovering Cities Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{userStatics.discovering_cities_earned_money}€</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Cities:</TableCell>
                                    <TableCell>{userStatics.discovering_cities_correctly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Cities:</TableCell>
                                    <TableCell>{userStatics.discovering_cities_incorrectly_answered_questions}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{userStatics.discovering_cities_games_played}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            default:
                return null;
        }
    };

    return (
        <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" align="center" gutterBottom>
                Statistics
            </Typography>
            <Box>
                <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '20px' }}>
                    Game Mode
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Button onClick={() => setSelectedMode('The Challenge')} variant="contained" style={{ marginRight: '10px', backgroundColor:'#006699', color:'#ffffff', borderColor:'#006699', '&:hover': { backgroundColor: '#ffffff' } }}>The Challenge</Button>
                    <Button onClick={() => setSelectedMode('Wise Men Stack')} variant="contained" style={{ marginRight: '10px', backgroundColor:'#006699', color:'#ffffff', borderColor:'#006699', '&:hover': { backgroundColor: '#ffffff' } }}>Wise Men Stack</Button>
                    <Button onClick={() => setSelectedMode('Warm Question')} variant="contained" style={{ marginRight: '10px', backgroundColor:'#006699', color:'#ffffff', borderColor:'#006699', '&:hover': { backgroundColor: '#ffffff' } }}>Warm Question</Button>
                    <Button onClick={() => setSelectedMode('Discovering Cities')} variant="contained" style={{ backgroundColor:'#006699', color:'#ffffff', borderColor:'#006699', '&:hover': { backgroundColor: '#ffffff' }  }}>Discovering Cities</Button>
                </div>
                {renderStatistics()}
            </Box>
        </Container>
    );
};

export default Statistics;