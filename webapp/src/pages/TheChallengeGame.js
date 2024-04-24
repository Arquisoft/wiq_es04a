import * as React from 'react';
import axios from 'axios';

import { Container, Box, Button, CssBaseline, Grid, Typography, CircularProgress, useTheme, MenuItem, Select, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import Confetti from 'react-confetti';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Card from '@mui/material/Card';
import { useTranslation } from 'react-i18next';
import i18n from '../localize/i18n';
import { PlayArrow, Pause } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const Game = () => {
    const navigate = useNavigate();
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const {username} = useContext(SessionContext);
    const theme = useTheme();

    const { t } = useTranslation();

    // Game configuration state
    const [numRounds, setNumRounds] = React.useState(3);
    const [timerConfig, setTimerConfig] = React.useState(15);
    const [configModalOpen, setConfigModalOpen] = React.useState(true);
    const [category, setCategory] = React.useState("Geography");

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
    const [userResponses, setUserResponses] = React.useState([]);
    const [language, setCurrentLanguage] = React.useState(i18n.language);
    const [paused, setPaused] = React.useState(false);
    const [passNewRound, setPassNewRound] = React.useState(false);

    const [questionHistorial, setQuestionHistorial] = React.useState(Array(numRounds).fill(null));

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
        if (round <= numRounds) {
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
    }, [round, numRounds]); 

    // stablish if the confetti must show or not
    React.useEffect(() => {
        if (correctlyAnsweredQuestions > incorrectlyAnsweredQuestions) {
          setShowConfetti(true);
        } else {
          setShowConfetti(false);
        }
      }, [correctlyAnsweredQuestions, incorrectlyAnsweredQuestions]);

    React.useEffect(() => {
        if (passNewRound && !paused) {
            setRound(prevRound => {
                return prevRound + 1;
            });
            setButtonStates([]);
        }
    }, [paused, passNewRound]);
     

    const startGame = () => {
        setConfigModalOpen(false);
        startNewRound();
    };

    const startNewRound = async () => {
        setAnswered(false);
        setPassNewRound(false);
        // It works deploying using git repo from machine with: axios.get(`http://20.80.235.188:8000/questions`)
        setCurrentLanguage(i18n.language);
        axios.get(`${apiEndpoint}/questions/${language}/${category}`) 
        .then(quest => {
            // every new round it gets a new question from db
            setQuestionData(quest.data[0]);    
            setButtonStates(new Array(quest.data[0].options.length).fill(null));
        }).catch(error => {
            console.error(error);
        }); 
        
    };

    const updateStatistics = async() => {
        try {
            await axios.put(`${apiEndpoint}/statistics`, {
                username:username,
                the_callenge_earned_money:totalScore,
                the_callenge_correctly_answered_questions:correctlyAnsweredQuestions,
                the_callenge_incorrectly_answered_questions:incorrectlyAnsweredQuestions,
                the_callenge_total_time_played:totalTimePlayed,
                the_callenge_games_played:1,
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
                online_earned_money: 0,
                online_correctly_answered_questions: 0,
                online_incorrectly_answered_questions: 0,
                online_total_time_played: 0,
                online_games_played: 0,
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
                gameMode: "TheChallenge"
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

        setTimeout(async() => {
            setPassNewRound(true);
            setCurrentLanguage(i18n.language);
        }, 4000);
    };

    // Render the configuration window before starting the game
    if (configModalOpen) {
        
        return(
            <Container sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', gap: '2em' }}>
                <Typography variant="h2" align="center" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>
                    {t("Game.config.title")}:
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <Typography htmlFor="numRounds" variant="h5">
                        {t("Game.config.num_rounds")}:
                    </Typography>
                    <IconButton size="large" color="error" disabled={numRounds === 1} onClick={() => setNumRounds(numRounds - 1)} variant="outlined" >
                        <RemoveIcon fontSize="inherit" />
                    </IconButton>
                    <Typography fontWeight="bold" color="primary" fontSize="1.5em">
                        {numRounds}
                    </Typography>
                    <IconButton size="large" color="success" onClick={() => setNumRounds(numRounds + 1)} variant="outlined">
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <Typography htmlFor="questionTime" variant="h5">
                        {t("Game.config.time")}:
                    </Typography>
                    <IconButton size="large" color="error" disabled={timerConfig === 1} onClick={() => setTimerConfig(timerConfig - 1)} variant="outlined">
                        <RemoveIcon fontSize="inherit" />
                    </IconButton>
                    <Typography fontWeight="bold" color="primary" fontSize="1.5em">
                        {timerConfig}
                    </Typography>
                    <IconButton size="large" color="success" onClick={() => setTimerConfig(timerConfig + 1)} variant="outlined">
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Box>

                {/* Dropdown for selecting category */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <Typography htmlFor="category" variant="h5">
                        {t("Game.config.category")}:
                    </Typography>
                    <Select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        style={{ minWidth: '120px' }}
                    >
                        <MenuItem value="Geography">{t("Game.categories.geography")}</MenuItem>
                        <MenuItem value="Political">{t("Game.categories.political")}</MenuItem>
                        <MenuItem value="Sports">{t("Game.categories.sports")}</MenuItem>
                    </Select>
                </Box>

                <Button
                    data-testid="start-button"
                    onClick={() => { startGame(); setQuestionHistorial(Array(numRounds).fill(null)); console.log(category) }}
                    variant="contained"
                    size='large'
                    sx={{
                        fontFamily: 'Arial Black, sans-serif',
                        color: theme.palette.primary.main,
                        backgroundColor: 'transparent',
                        border: `2px solid ${theme.palette.primary.main}`,
                        transition: 'background-color 0.3s ease',

                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                        }
                    }}
                >
                    {t("Game.start")}
                </Button>
            </Container>
        );
    }

    const questionHistorialBar = () => {
        return questionHistorial.map((isCorrect, index) => (
            <Card sx={{ width: `${100 / numRounds}%`,
             padding:'0.2em', 
             margin:'0 0.1em', 
             backgroundColor: isCorrect === null ? 'gray' : isCorrect ? theme.palette.success.main : theme.palette.error.main }}
            >
            </Card>
        ));
    };    

    const togglePause = () => {
        setTimerRunning(!timerRunning);
        setPaused(!paused);
    }


    // circular loading
    if (!questionData) {
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
                <CircularProgress />
            </Container>
        );
    }

 // redirect to / if game over 
 if (shouldRedirect) {
    // Redirect after 4 seconds
    setTimeout(() => {
        navigate('/homepage');
    }, 4000);


    return (
        <Container
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '5em',
                textAlign: 'center',
                flex: '1'
            }}
        >
            <CssBaseline />
            <Typography variant="h2" data-testid="end-game-message"
                    sx={{ color: correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? theme.palette.success.main : theme.palette.error.main }}>
                {correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? t("Game.win_msg") : t("Game.lose_msg") }
            </Typography>
            <Container>
                <Typography variant="h4">{ t("Game.correct") }: {correctlyAnsweredQuestions}</Typography>
                <Typography variant="h4">{ t("Game.incorrect") }: {incorrectlyAnsweredQuestions}</Typography>
                <Typography variant="h4">{ t("Game.money") }: {totalScore}</Typography>
                <Typography variant="h4">{ t("Game.time") }: {totalTimePlayed}</Typography>
            </Container>
            {showConfetti && <Confetti />}
        </Container>
    );
}

return (
    <Container
        sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center', 
            textAlign: 'center',
            flex: '1',
            gap: '2em',
            margin: '2em auto 1em',
        }}
    >
        <CssBaseline />

        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            { answered ?
                // Pausa
                <Button variant="contained" onClick={() => togglePause()} sx={{ height: 100, width: 100, borderRadius: '50%' }} data-testid={ paused ? "play" : "pause"}>
                    { paused ? <PlayArrow /> : <Pause /> }
                </Button>
                :
                // Cronómetro
                <CountdownCircleTimer
                    data-testid="circleTimer"
                    key={questionCountdownKey}
                    isPlaying = {questionCountdownRunning}
                    duration={timerConfig}
                    colors={[theme.palette.success.main, "#F7B801", "#f50707", theme.palette.error.main]}
                    size={100}
                    colorsTime={[10, 6, 3, 0]}
                    onComplete={() => selectResponse(-1, "FAILED")} //when time ends always fail question
                    >
                    {({ remainingTime }) => {
                        return (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{remainingTime}</div>
                        </div>
                        );
                    }}
                </CountdownCircleTimer>
            }
        </Container>

        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <Typography variant="h4" data-testid="question" sx={{ fontWeight:'bold', marginBottom:'0.7em' }} >
                {questionData.question.toUpperCase()}
            </Typography>

            <Grid container spacing={2}>
                {questionData.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                        <Button
                            //data-testid="answer"
                            data-testid={buttonStates[index] === "success" ? `success${index}` : buttonStates[index] === "failure" ? `failel${index}` : `answer${index}`}
                            variant="contained"
                            onClick={() => selectResponse(index, option)}
                            disabled={buttonStates[index] !== null || answered} // before, you could still press more than one button
                            sx={{
                                height: "3.3em",
                                width: "50%",
                                borderRadius: "10px",
                                margin: "5px",
                                "&:disabled": {
                                    backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : "gray",
                                    color: "white",
                                },
                            }}
                        >
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