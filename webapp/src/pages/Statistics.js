import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, useTheme } from '@mui/material';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const theme = useTheme();
    const { username } = useContext(SessionContext);
    const [userStatics, setUserStatics] = useState([]);
    const [selectedMode, setSelectedMode] = useState('The Challenge');
    const [questionsRecord, setQuestionsRecord] = useState([]);
    const [showQuestionsRecord, setShowQuestionsRecord] = useState(false);

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

    useEffect(() => {
        const fetchQuestionsRecord = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/user/questionsRecord/${username}/${selectedMode}`, {
                    username: username,
                    gameMode: selectedMode
                });
                console.log('Questions Record:', response.data.questions);
                console.log('Questions Record:', response.data);
                setQuestionsRecord(response.data);
            } catch (error) {
                console.error('Error fetching questions record:', error);
            }
        };

        fetchQuestionsRecord();
    }, [username, selectedMode]);

    const renderStatistics = () => {
        const formatStats = (param) => {
            return (param === null || param === undefined) ? '0' : param;
        };

        switch (selectedMode) {
            case 'The Challenge':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="The Challenge Statistics">
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
                        <Table sx={{ minWidth: 360 }} aria-label="Wise Men Stack Statistics">
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
                        <Table sx={{ minWidth: 360 }} aria-label="Warm Question Statistics">
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
                        <Table sx={{ minWidth: 360 }} aria-label="Discovering Cities Statistics">
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

    const renderQuestions = () => {
        if (showQuestionsRecord) {
            return questionsRecord.map((record, index) => (
                <div key={index}>
                    <Typography variant="h5" gutterBottom>
                        Questions Record {record.createdAt}
                    </Typography>
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label={`Questions Record ${index + 1}`}>
                            <TableBody>
                                {record.questions.map((question, questionIndex) => (
                                    <TableRow key={questionIndex}>
                                        <TableCell>{question.question}</TableCell>
                                        <TableCell>
                                            <ul>
                                                {question.options.map((option, optionIndex) => (
                                                    <li
                                                        key={optionIndex}
                                                        style={{
                                                            color: option === question.correctAnswer ? 'green' : question.response === option ? 'red' : 'black',
                                                        }}
                                                    >
                                                        {option}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ));
        }
    };

    return (
        <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" align="center" gutterBottom>
                STATISTICS
            </Typography>
            <Box>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Button onClick={() => setSelectedMode('The Challenge')} variant="contained" sx={{ marginRight: '10px', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>The Challenge</Button>
                    <Button onClick={() => setSelectedMode('Wise Men Stack')} variant="contained" sx={{ marginRight: '10px', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>Wise Men Stack</Button>
                    <Button onClick={() => setSelectedMode('Warm Question')} variant="contained" sx={{ marginRight: '10px', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>Warm Question</Button>
                    <Button onClick={() => setSelectedMode('Discovering Cities')} variant="contained" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>Discovering Cities</Button>
                </div>
                {renderStatistics()}
                <Button
                    onClick={() => setShowQuestionsRecord(!showQuestionsRecord)}
                    variant="contained"
                    sx={{ marginTop: '10px', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}
                >
                    {showQuestionsRecord ? 'Hide Questions Record' : 'Show Questions Record'}
                </Button>
                {renderQuestions()}
            </Box>
        </Container>
    );
};

export default Statistics;