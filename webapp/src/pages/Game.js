import * as React from 'react';
import axios from 'axios';

import { Container, Button, CssBaseline, Grid, Typography, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const Game = () => {
    const navigate = useNavigate();
    const MAX_ROUNDS = 3;
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const {username} = useContext(SessionContext);

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
    const [questionCountdownKey, setQuestionCountdownKey] = React.useState(15);
    const [questionCountdownRunning, setQuestionCountdownRunning] = React.useState(false);

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
        }
    }, [round]);

    // gets a random question from the database and initializes button states to null
    const startNewRound = async () => {
        setAnswered(false);
        // It works deploying using git repo from machine with: axios.get(`http://20.80.235.188:8000/questions`)
        axios.get(`${apiEndpoint}/questions`)
        .then(quest => {
            // every new round it gets a new question from db
            setQuestionData(quest.data);    
            setButtonStates(new Array(quest.data.options.length).fill(null));
        }).catch(error => {
            console.error(error);
        }); 
        
    };

    // this function is called when a user selects a response. 
    const selectResponse = async (index, response) => {
        setAnswered(true);
        const newButtonStates = [...buttonStates];

        setQuestionCountdownRunning(false);

        //check answer
        if (response === questionData.correctAnswer) {
            newButtonStates[index] = "success"
            const sucessSound = new Audio(SUCCESS_SOUND_ROUTE);
            sucessSound.volume = 0.40;
            sucessSound.play();
            setCorrectlyAnsweredQuestions(correctlyAnsweredQuestions + 1);
            setTotalScore(totalScore + 20);
        } else {
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
        }

        setButtonStates(newButtonStates);

        if (round >= 3) {
            // Update user data before redirecting
            try {
                await axios.post(`${apiEndpoint}/statics/edit`, {
                    username:username,
                    earned_money:totalScore,
                    classic_correctly_answered_questions:correctlyAnsweredQuestions,
                    classic_incorrectly_answered_questions:incorrectlyAnsweredQuestions,
                    classic_total_time_played:totalTimePlayed,
                    classic_games_played:1
                  });
              } catch (error) {
                console.error("Error:", error);
              }
        }

        setTimeout(() => {
            setRound(round + 1);
            setButtonStates([]);
        }, 2000);
    };


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
    // Redirect after 3 seconds
    setTimeout(() => {
        navigate('/homepage');
    }, 4000);

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
                color: correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? 'green' : 'red',
                fontSize: '4rem', // Tamaño de fuente
                marginTop: '20px', // Espaciado superior
                marginBottom: '50px', // Espaciado inferior
            }}
        >
            {correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? "Great Job!" : "Game Over"}
        </Typography>
            <div>
                <Typography variant="h6">Correct Answers: {correctlyAnsweredQuestions}</Typography>
                <Typography variant="h6">Incorrect Answers: {incorrectlyAnsweredQuestions}</Typography>
                <Typography variant="h6">Total money: {totalScore}</Typography>
                <Typography variant="h6">Time: {totalTimePlayed} seconds</Typography>
            </div>
        </Container>
    );
}
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
                variant="h6"
                sx={{
                    position: 'absolute',
                    top: '10%', 
                    right: '5%', 
                }}
            >
                Time: {totalTimePlayed} s
            </Typography>
            <Typography variant='h6' >
                {round} / {MAX_ROUNDS}
            </Typography>
            <Typography variant="h5" mb={4} fontWeight="bold" style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '1em' }}>{questionData.question}</span>
                <CountdownCircleTimer
                  key={questionCountdownKey}
                  isPlaying = {questionCountdownRunning}
                  duration={15}
                  colors={["#0bfc03", "#F7B801", "#f50707", "#A30000"]}
                  size={100}
                  colorsTime={[10, 6, 3, 0]}
                  onComplete={() => ({ shouldRepeat: true, delay: 1 })}
                >
                  {({ remainingTime }) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{remainingTime}</div>
                      </div>
                    );
                  }}
                </CountdownCircleTimer>
            </Typography>

            <Grid container spacing={2}>
                {questionData.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                        <Button
                            variant="contained"
                            onClick={() => selectResponse(index, option)}
                            disabled={buttonStates[index] !== null || answered} // before, you could still press more than one button
                            sx={{
                                height: "50px", // Ajusta el tamaño según sea necesario
                                width: "50%", // Ajusta el ancho según sea necesario
                                borderRadius: "20px", // Ajusta el radio según sea necesario
                                margin: "5px",
                                backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
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
    );
};

export default Game;
