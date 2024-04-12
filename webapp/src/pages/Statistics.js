import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const theme = useTheme();

    const [error, setError] = useState('');
    const [userStatics, setUserStatics] = useState([]);
    const [selectedMode, setSelectedMode] = useState('The Challenge');
    const { username } = useContext(SessionContext);
    const { user } = useParams();

    useEffect(() => {
        const fetchUserStatics = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/user/statistics/${user}`, { params: { loggedUser: username } });
                setUserStatics(response.data);
            } catch (error) {
                setError(error.response.data.error);
            }
        };

        fetchUserStatics();
    }, [user, username]);

    const renderStatistics = () => {
        const formatStats = (param) => {
            return (param === null || param === undefined)?'0':param;
        };

        switch (selectedMode) {
            case 'The Challenge':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="The Challenge Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Time Played:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_total_time_played)} ''</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_games_played)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'Wise Men Stack':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="Wise Men Stack Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_games_played)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'Warm Question':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="Warm Question Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Passed Questions:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_passed_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_games_played)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'Discovering Cities':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="Discovering Cities Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Earned Money:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Correctly Answered Cities:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Incorrectly Answered Cities:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Games Played:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_games_played)}</TableCell>
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
            <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
                STATISTICS
            </Typography>
            {error? (
                <Container sx={{ margin: '0 auto auto' }}>
                    <Typography variant="h5" sx={{ textAlign:'center' }}>{error}</Typography>
                </Container>
            ):(
                <Box>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <Button onClick={() => setSelectedMode('The Challenge')} variant="contained" sx={{ marginRight: '10px', backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main } }}>The Challenge</Button>
                        <Button onClick={() => setSelectedMode('Wise Men Stack')} variant="contained" sx={{ marginRight: '10px', backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main } }}>Wise Men Stack</Button>
                        <Button onClick={() => setSelectedMode('Warm Question')} variant="contained" sx={{ marginRight: '10px', backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main } }}>Warm Question</Button>
                        <Button onClick={() => setSelectedMode('Discovering Cities')} variant="contained" sx={{ backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main }  }}>Discovering Cities</Button>
                    </div>
                    {renderStatistics()}
                </Box>
            )}
        </Container>
    );
};

export default Statistics;