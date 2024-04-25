import * as React from 'react';
import axios from 'axios';
import { useTheme, Container, Button, CssBaseline, Grid, Typography, CircularProgress, Card, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import Confetti from 'react-confetti';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import i18n from '../localize/i18n';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
const socketEndpoint = process.env.REACT_APP_MULTIPLAYER_ENDPOINT || 'ws://localhost:5010';

const Game = () => {    
    const MAX_ROUNDS = 3;
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const {username} = useContext(SessionContext);

    // Translations
    const { t } = useTranslation();

    const theme = useTheme();

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [answered, setAnswered] = React.useState(false);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [totalScore, setTotalScore] = React.useState(0);
    const [correctlyAnsweredQuestions, setCorrectlyAnsweredQuestions] = React.useState(0);
    const [incorrectlyAnsweredQuestions, setIncorrectlyAnsweredQuestions] = React.useState(0);
    const [totalTimePlayed, setTotalTimePlayed] = React.useState(0);
    const [timerRunning, setTimerRunning] = React.useState(true); // indicate if the timer is working
    const [showConfetti, setShowConfetti] = React.useState(false); //indicates if the confetti must appear
    const [questionCountdownKey, setQuestionCountdownKey] = React.useState(15); //key to update question timer
    const [questionCountdownRunning, setQuestionCountdownRunning] = React.useState(false); //property to start and stop question timer
    const [questionHistorial, setQuestionHistorial] = React.useState(Array(MAX_ROUNDS).fill(null));
    const [userResponses, setUserResponses] = React.useState([]);
    const [, setCurrentLanguage] = React.useState(i18n.language);

    const location = useLocation();
    const { gameQuestions, roomCode} = location.state;
    const [socket, setSocket] = React.useState(null);

    const[winnerPlayer, setWinnerPlayer] = React.useState("");
    const[winnerCorrect, setWinnerCorrect] = React.useState(0);
    const[winnerTime, setWinnerTime] = React.useState(0);
    
    React.useEffect(() => {
        const newSocket = io(socketEndpoint);
        setSocket(newSocket);
        newSocket.emit('join-room', roomCode, username);

        newSocket.on("winner-player", ((winner, winnerCorrect, winnerTime) => {
            setWinnerPlayer(winner);
            setWinnerCorrect(winnerCorrect);
            setWinnerTime(winnerTime);
        }))
    }, [roomCode, username]);

    React.useEffect(() => {
        let timer;
        if (timerRunning) {
            timer = setInterval(() => {
                setTotalTimePlayed((prevTotalTime) => prevTotalTime + 1);
            }, 1000);
        }
    
        return () => clearInterval(timer);
    }, [timerRunning]);

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        if (round <= MAX_ROUNDS) {
            startNewRound();
            setQuestionCountdownRunning(true);
            setQuestionCountdownKey(questionCountdownKey => questionCountdownKey + 1); //code to reset countdown timer
        } else {
            setTimerRunning(false);
            setShouldRedirect(true);
            setQuestionCountdownRunning(false);
            updateStatistics();
            updateQuestionsRecord();

        }
        // eslint-disable-next-line
    }, [round]);

    // stablish if the confetti must show or not
    React.useEffect(() => {
        winnerPlayer === username ? setShowConfetti(true) : setShowConfetti(false);
      }, [winnerPlayer, username]);
    

    // gets a random question from the database and initializes button states to null
    const startNewRound = async () => {
        setAnswered(false);
        const quest = gameQuestions[round-1]
        setQuestionData(quest);    
        setButtonStates(new Array(quest.options.length).fill(null));
    };

    const updateStatistics = async() => {
        try {
            await axios.put(`${apiEndpoint}/statistics`, {
                username:username,
                the_callenge_earned_money:0,
                the_callenge_correctly_answered_questions:0,
                the_callenge_incorrectly_answered_questions:0,
                the_callenge_total_time_played:0,
                the_callenge_games_played:0,
                wise_men_stack_earned_money: 0,
                wise_men_stack_correctly_answered_questions: 0,
                wise_men_stack_incorrectly_answered_questions: 0,
                wise_men_stack_games_played: 0,
                warm_question_earned_money: 0,
                warm_question_correctly_answered_questions: 0,
                warm_question_incorrectly_answered_questions: 0,
                warm_question_passed_questions: 0,
                warm_question_games_played: 0,
                discovering_cities_earned_money: 0,
                discovering_cities_correctly_answered_questions: 0,
                discovering_cities_incorrectly_answered_questions: 0,
                discovering_cities_games_played: 0,
                online_earned_money: totalScore,
                online_correctly_answered_questions: correctlyAnsweredQuestions,
                online_incorrectly_answered_questions: incorrectlyAnsweredQuestions,
                online_total_time_played: totalTimePlayed,
                online_games_played: 1,
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    const updateQuestionsRecord = async() => {
        try {
            await axios.put(`${apiEndpoint}/questionsRecord`, {
                questions: userResponses,
                username: username,
                gameMode: "OnlineMode"
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    // this function is called when a user selects a response. 
    const selectResponse = async (index, response) => {
        setAnswered(true);
        const newButtonStates = [...buttonStates];

        setQuestionCountdownRunning(false);

        //check answer
        if (response === questionData.correctAnswer) {
            const userResponse = {
                question: questionData.question,
                response: response,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer
            };
            setUserResponses(prevResponses => [...prevResponses, userResponse]);

            newButtonStates[index] = "success"
            const sucessSound = new Audio(SUCCESS_SOUND_ROUTE);
            sucessSound.volume = 0.40;
            sucessSound.play();
            setCorrectlyAnsweredQuestions(correctlyAnsweredQuestions + 1);
            setTotalScore(totalScore + 20);

            const newQuestionHistorial = [...questionHistorial];
            newQuestionHistorial[round-1] = true;
            setQuestionHistorial(newQuestionHistorial);
        } else {
            const userResponse = {
                question: questionData.question,
                response: response,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer
            };
            setUserResponses(prevResponses => [...prevResponses, userResponse]);
            
            newButtonStates[index] = "failure";
            const failureSound = new Audio(FAILURE_SOUND_ROUTE);
            failureSound.volume = 0.40;
            failureSound.play();
            for (let i = 0; i < questionData.options.length; i++) {
                if (questionData.options[i] === questionData.correctAnswer) {
                    newButtonStates[i] = "success";
                }
            }
            setIncorrectlyAnsweredQuestions(incorrectlyAnsweredQuestions + 1);

            const newQuestionHistorial = [...questionHistorial];
            newQuestionHistorial[round-1] = false;
            setQuestionHistorial(newQuestionHistorial);
        }

        setButtonStates(newButtonStates);

        setTimeout(() => {
            setRound(round + 1);
            setButtonStates([]);
            setCurrentLanguage(i18n.language);
        }, 2000);
    };

    const questionHistorialBar = () => {
        return questionHistorial.map((isCorrect, index) => (
            <Card data-testid={`prog_bar${index}`} sx={{ width: `${100 / MAX_ROUNDS}%`, padding:'0.2em', margin:'0 0.1em', backgroundColor: isCorrect === null ? 'gray' : isCorrect ? theme.palette.success.main : theme.palette.error.main }}/>
        ));
    };    

    // circular loading
    if (!questionData) {
        return (
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                <CssBaseline />
                <CircularProgress />
            </Container>
        );
    }

    if (shouldRedirect) {
        socket.emit("finished-game", username, correctlyAnsweredQuestions, totalTimePlayed);

        return (
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <CssBaseline />
                <Typography 
                variant="h4" 
                sx={{
                    color: winnerPlayer === username ? 'green' : 'black',
                    fontSize: '4rem', // Tamaño de fuente
                    marginTop: '20px', // Espaciado superior
                    marginBottom: '50px', // Espaciado inferior
                }}
            >
                
                <Typography variant="h2" gutterBottom sx={{ fontFamily: 'fantasy', color: '#323333' }}>
                {winnerPlayer === "" ? t("Multiplayer.Game.waiting_players_end") : "Game Over"}
                </Typography>
            </Typography>
                <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'fantasy', color: '#323333' }}>
                        {t("Game.correct")}: {correctlyAnsweredQuestions}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'fantasy', color: '#323333' }}>
                        {t("Game.incorrect")}: {incorrectlyAnsweredQuestions}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'fantasy', color: '#323333' }}>
                        {t("Game.money")}: {totalScore}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'fantasy', color: '#323333' }}>
                        {t("Game.time")}: {totalTimePlayed}
                        </Typography>
                    </Grid>
                </Grid>

                    {winnerPlayer === "" ? (
                        <Typography variant="h5" sx={{marginTop: '1em', fontFamily: 'fantasy', color: '#323333'}}>{ t("Multiplayer.Game.waiting") }</Typography>
                    ) : (
                        <Typography variant="h5" sx={{marginTop: '1em', fontFamily: 'fantasy', color: '#323333'}}>{ t("Multiplayer.Game.winner_1") }: {winnerPlayer} { t("Multiplayer.Game.winner_2") } {winnerCorrect} { t("Multiplayer.Game.winner_3") } {winnerTime} { t("Multiplayer.Game.winner_4") }</Typography>
                    )}
                </div>
                {showConfetti && <Confetti />}
            </Container>
        );
    }
    
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center', flex: '1', gap: '2em', margin: '0 auto', padding: '1em 0' }}>
            <CssBaseline />

            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <CountdownCircleTimer data-testid="circleTimer" key={questionCountdownKey} isPlaying = {questionCountdownRunning} duration={15} colorsTime={[10, 6, 3, 0]}
                    colors={[theme.palette.success.main, "#F7B801", "#f50707", theme.palette.error.main]} size={100} onComplete={() => selectResponse(-1, "FAILED")}>
                    {({ remainingTime }) => {
                        return (
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography fontSize='1.2em' fontWeight='bold'>{remainingTime}</Typography>
                            </Box>
                        );
                    }}
                </CountdownCircleTimer>
            </Container>    

            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }} >
                <Typography variant="h4" data-testid="question" fontWeight="bold" >
                    {questionData.question.toUpperCase()}
                </Typography>

                <Grid container spacing={2} gap="0.7em">
                    {questionData.options.map((option, index) => (
                        <Grid item xs={12} key={index}>
                            <Button data-testid={buttonStates[index] === "success" ? `success${index}` : buttonStates[index] === "failure" ? `failel${index}` : `answer${index}`}
                                variant="contained" onClick={() => selectResponse(index, option)} disabled={buttonStates[index] !== null || answered}
                                sx={{ height: "3.3em", width: "50%", borderRadius: "10px", "&:disabled": { backgroundColor: buttonStates[index] === "success" ? theme.palette.success.main : buttonStates[index] === "failure" ? theme.palette.error.main : "gray", color: "white"}}}>
                                {buttonStates[index] === "success" ? <CheckIcon /> : buttonStates[index] === "failure" ? <ClearIcon /> : null}
                                {option}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Progress Cards */}
            <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop:'2em' }} >
                {questionHistorialBar()}
            </Container>
        </Container>
    );
};

export default Game;
