import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, useTheme, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Statistics = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [error, setError] = useState('');

    const [userStatics, setUserStatics] = useState([]);
    const [selectedMode, setSelectedMode] = useState('TheChallenge');
    const [questionsRecord, setQuestionsRecord] = useState([]);
    const [showQuestionsRecord, setShowQuestionsRecord] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
    }, [username, username]);

    useEffect(() => {
        const fetchQuestionsRecord = async () => {
            try {
                const response = await axios.get(`${apiEndpoint}/user/questionsRecord/${username}/${selectedMode}`, {
                    username: username,
                    gameMode: selectedMode
                });
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
            case 'TheChallenge':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="The Challenge Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.the_callenge_earned_money)}</TableCell>
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
            case 'WiseMenStack':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="Wise Men Stack Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.wise_men_stack_earned_money)}</TableCell>
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
            case 'WarmQuestion':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="Warm Question Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.warm_question_earned_money > 0? userStatics.warm_question_earned_money : 0)}</TableCell>
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
            case 'DiscoveringCities':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360, backgroundColor:'rgba(84,95,95,0.3)', borderRadius:'10px' }} aria-label="Discovering Cities Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.discovering_cities_earned_money)}</TableCell>
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
                case 'OnlineMode':
                return (
                    <TableContainer>
                        <Table sx={{ minWidth: 360 }} aria-label="The Online Mode Statistics">
                            <TableBody>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.money") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.online_earned_money)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_corr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.online_correctly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.questions_incorr") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.online_incorrectly_answered_questions)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.total_time") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.online_total_time_played)} ''</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{ t("Statistics.table.played_games") }:</TableCell>
                                    <TableCell>{formatStats(userStatics.online_games_played)}</TableCell>
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
        return date.toLocaleString('en-US', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
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
                {currentItems.length > 0 && (
                    <div style={{ marginBottom: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
                        <button onClick={handlePrevPage} disabled={currentPage === 1} style={{ fontSize: '1rem' }}>&lt;</button>
                        <p style={{ margin: '0 4%', fontSize: '1rem' }}>Page {currentPage} of {totalPages === 0 ? 1 : totalPages}</p>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} style={{ fontSize: '1rem' }}>&gt;</button>
                    </div>
                )}
            </div>
            );
        }
    };

    return (
        <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            { t("Statistics.title") }
            </Typography>
            {error? (
                <Container sx={{ margin: '0 auto auto' }}>
                    <Typography variant="h5" sx={{ textAlign:'center' }}>{error}</Typography>
                </Container>
            ):(
                <Box>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Button onClick={() => setSelectedMode('TheChallenge')} variant="contained" sx={{ marginBottom: isSmallScreen ? '0.5em' : '0', marginRight: isSmallScreen ? '0' : '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>
                            { t("Games.challenge.name") }
                        </Button>
                        <Button onClick={() => setSelectedMode('WiseMenStack')} variant="contained" sx={{ marginBottom: isSmallScreen ? '0.5em' : '0', marginRight: isSmallScreen ? '0' : '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>
                            { t("Games.wise_men.name") }
                        </Button>
                        <Button onClick={() => setSelectedMode('WarmQuestion')} variant="contained" sx={{ marginBottom: isSmallScreen ? '0.5em' : '0', marginRight: isSmallScreen ? '0' : '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>
                            { t("Games.warm_quest.name") }
                        </Button>
                        <Button onClick={() => setSelectedMode('DiscoveringCities')} variant="contained" sx={{ marginBottom: isSmallScreen ? '0.5em' : '0', marginRight: isSmallScreen ? '0' : '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>
                            { t("Games.discover.name") }
                        </Button>
                        <Button onClick={() => setSelectedMode('OnlineMode')} variant="contained" sx={{ marginBottom: isSmallScreen ? '0.5em' : '0', marginRight: isSmallScreen ? '0' : '0.5em', backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main, borderColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main, borderColor: theme.palette.primary.main } }}>
                            { "Online Mode" }
                        </Button>
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
            )}    
        </Container>
    );
};

export default Statistics;