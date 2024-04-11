import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, useTheme } from '@mui/material';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const { t } = useTranslation();
    const theme = useTheme();

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
        const formatStats = (param) => {
            return (param === null || param === undefined)?'0':param;
        };

        switch (selectedMode) {
            case 'The Challenge':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="The Challenge Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_corr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_incorr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.total_time") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_total_time_played)} ''</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.played_games") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_games_played)}</TableCell>
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
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_corr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_incorr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.played_games") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_games_played)}</TableCell>
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
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_corr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_incorr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_pass") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_passed_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.played_games") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_games_played)}</TableCell>
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
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_earned_money)} €</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.cities_corr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.cities_incorr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.played_games") }:</TableCell>
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
            <Typography variant="h3" align="center" gutterBottom>
                { t("Statistics.title") }
            </Typography>
            <Box>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Button onClick={() => setSelectedMode('The Challenge')} variant="contained" sx={{ marginRight: '10px', backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main } }}>
                        { t("Games.challenge.name") }
                    </Button>
                    <Button onClick={() => setSelectedMode('Wise Men Stack')} variant="contained" sx={{ marginRight: '10px', backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main } }}>
                        { t("Games.wise_men.name") }
                    </Button>
                    <Button onClick={() => setSelectedMode('Warm Question')} variant="contained" sx={{ marginRight: '10px', backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main } }}>
                        { t("Games.warm_quest.name") }
                    </Button>
                    <Button onClick={() => setSelectedMode('Discovering Cities')} variant="contained" sx={{ backgroundColor:theme.palette.primary.main, color:theme.palette.secondary.main, borderColor:theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color:theme.palette.primary.main, borderColor:theme.palette.primary.main }  }}>
                        { t("Games.discover.name") }
                    </Button>
                </div>
                {renderStatistics()}
            </Box>
        </Container>
    );
};

export default Statistics;