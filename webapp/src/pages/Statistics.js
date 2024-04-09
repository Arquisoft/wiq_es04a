import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, useTheme, Grid } from '@mui/material';
import { SessionContext } from '../SessionContext';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const theme = useTheme();
    const { username } = useContext(SessionContext);
    const [userStatics, setUserStatics] = useState([]);
    const [selectedMode, setSelectedMode] = useState('The Challenge');
    const [questionsRecord, setQuestionsRecord] = useState([]);
    const [showQuestionsRecord, setShowQuestionsRecord] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;

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

    const totalPages = Math.ceil(questionsRecord.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

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

    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const renderQuestions = () => {
        if (showQuestionsRecord) {
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = questionsRecord.slice(indexOfFirstItem, indexOfLastItem);
    
            return (
                <div>
                    {currentItems.map((record, index) => (
                        <div key={index}>
                        <Typography variant="h5" gutterBottom>
                            Game {formatCreatedAt(record.createdAt)}
                        </Typography>

                        <Grid container spacing={2}>
                            {record.questions.map((question, questionIndex) => (
                                <Grid item xs={12} key={questionIndex}>
                                    <Box sx={{ bgcolor: '#f0f0f0', borderRadius: '20px', padding: '2%' }}>
                                        <Typography variant="body1" gutterBottom>
                                            {question.correctAnswer === question.response ? <CheckIcon style={{color: 'green', fontSize: '1.2rem'}} /> : <ClearIcon style={{color: 'red', fontSize: '1.2rem'}} />}
                                            {question.question}
                                        </Typography>
                                        {question.options.map((option, optionIndex) => (
                                            <Box
                                                key={optionIndex}
                                                sx={{
                                                    bgcolor: option === question.correctAnswer ? 'green' : question.response === option ? 'red' : '#ffffff',
                                                    color: option === question.correctAnswer || option === question.response ? '#ffffff' : 'inherit', 
                                                    borderRadius: '20px',
                                                    padding: '2%',
                                                    border: '1px solid #ccc',
                                                    marginTop: '2%',
                                                }}
                                >
                                                {option === question.correctAnswer? <CheckIcon />: option === question.response? <ClearIcon /> : null}
                                                {option}
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ))}
                <div style={{ marginBottom: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} style={{ fontSize: '1rem' }}>&lt;</button>
                    <p style={{ margin: '0 4%', fontSize: '1rem' }}>Page {currentPage} of {totalPages}</p>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} style={{ fontSize: '1rem' }}>&gt;</button>
                </div>
            </div>
            );
        }
    };

    return (
        <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" align="center" gutterBottom>
                STATISTICS
            </Typography>
            <Box>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5em' }}>
                    <Button onClick={() => setSelectedMode('The Challenge')} variant="contained" sx={{ marginRight: '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>The Challenge</Button>
                    <Button onClick={() => setSelectedMode('Wise Men Stack')} variant="contained" sx={{ marginRight: '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>Wise Men Stack</Button>
                    <Button onClick={() => setSelectedMode('Warm Question')} variant="contained" sx={{ marginRight: '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>Warm Question</Button>
                    <Button onClick={() => setSelectedMode('Discovering Cities')} variant="contained" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>Discovering Cities</Button>
                </div>
                {renderStatistics()}
                <Button
                    onClick={() => setShowQuestionsRecord(!showQuestionsRecord)}
                    variant="contained"
                    sx={{ marginBottom: '0.5em', marginTop: '0.5em', backgroundColor: 'green', color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}
                >
                    {showQuestionsRecord ? 'Hide Questions Record' : 'Show Questions Record'}
                </Button>
                {renderQuestions()}
            </Box>
        </Container>
    );
};

export default Statistics;