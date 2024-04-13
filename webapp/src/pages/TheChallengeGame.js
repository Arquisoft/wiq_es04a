import * as React from 'react';
import axios from 'axios';

import { Container, Button, CssBaseline, Grid, Typography, CircularProgress, useTheme, MenuItem, Select } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import Confetti from 'react-confetti';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const Game = () => {
    const navigate = useNavigate();
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const {username} = useContext(SessionContext);
    const theme = useTheme();

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
     

    const startGame = () => {
        setConfigModalOpen(false);
        startNewRound();
    };
    
    // gets a random question from the database and initializes button states to null
    const startNewRound = async () => {
        setAnswered(false);
        // It works deploying using git repo from machine with: axios.get(`http://20.80.235.188:8000/questions`)
        axios.get(`${apiEndpoint}/questions/${category}`) 
        .then(result => {
            result.data.map(quest => {
            // every new round it gets a new question from db
            setQuestionData(quest);    
            setButtonStates(new Array(quest.options.length).fill(null));
            });
        }).catch(error => {
            console.error(error);
        }); 
        
    };

    const updateStatistics = async() => {
        try {
            await axios.post(`${apiEndpoint}/statistics/edit`, {
                username:username,
                the_callenge_earned_money:totalScore,
                the_callenge_correctly_answered_questions:correctlyAnsweredQuestions,
                the_callenge_incorrectly_answered_questions:incorrectlyAnsweredQuestions,
                the_callenge_total_time_played:totalTimePlayed,
                the_callenge_games_played:1
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    const updateQuestionsRecord = async() => {
        try {
            await axios.post(`${apiEndpoint}/user/questionsRecord`, {
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
            setRound(round + 1);
            setButtonStates([]);
        }, 4000);
    };

    const questionHistorialBar = () => {
        return questionHistorial.map((isCorrect, index) => (
        <Card 
          key={index + 1}
          variant="outlined"
          style={{ 
            width: `${100 / numRounds}%`,
            marginRight: '0.6em',
            backgroundColor: isCorrect === null ? 'gray' : isCorrect ? 'lightgreen' : 'salmon',
          }}
        >
          <CardContent>{index + 1}</CardContent>
        </Card>
        ));
    };    

    // Render the configuration window before starting the game
    if (configModalOpen) {
        
        return(
            <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h2" sx={{ marginBottom: '1em' }}>Game Configuration</Typography>

                <div style={{ marginBottom: '1em' }}>
                    <label style={{ margin: '0.5em' }} htmlFor="numRounds">Number of rounds:</label>
                    <Button disabled={numRounds === 1} onClick={() => setNumRounds(numRounds - 1)} variant="outlined" >-</Button>
                    <span style={{ margin: '0.5em' }}>{numRounds}</span>
                    <Button onClick={() => setNumRounds(numRounds + 1)} variant="outlined">+</Button>
                </div>

                <div style={{ marginBottom: '1em' }}>
                    <label style={{ margin: '0.5em' }} htmlFor="questionTime">Time per question (seconds):</label>
                    <Button disabled={timerConfig === 1} onClick={() => setTimerConfig(timerConfig - 1)} variant="outlined">-</Button>
                    <span style={{ margin: '0.5em' }}>{timerConfig}</span>
                    <Button onClick={() => setTimerConfig(timerConfig + 1)} variant="outlined">+</Button>
                </div>

                {/* Dropdown for selecting category */}
                <div style={{ marginBottom: '1em' }}>
                    <label style={{ margin: '0.5em' }} htmlFor="category">Category:</label>
                    <Select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        style={{ minWidth: '120px' }}
                    >
                        <MenuItem value="Geography">Geography</MenuItem>
                        <MenuItem value="Political">Political</MenuItem>
                        <MenuItem value="Sports">Sports</MenuItem>
                    </Select>
                </div>

                <Button
                    onClick={() => { startGame(); setQuestionHistorial(Array(numRounds).fill(null)); console.log(category) }}
                    variant="contained"
                    sx={{
                        marginBottom: '0.5em',
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.secondary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.primary.main,
                        }
                    }}
                >
                    Start game
                </Button>
            </Container>
        );
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
            data-testid="end-game-message"
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
                <Typography variant="h6">Game time: {totalTimePlayed} seconds</Typography>
            </div>
            {showConfetti && <Confetti />}
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

            <Container
            sx={{
                position: 'center',
                top: '10%', 
                right: '20%', 
            }}>
                <Container
                    sx={{
                        display: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {questionHistorialBar()}
                </Container>
            </Container>

            <Typography variant='h6' data-testid="numRound">
                {round} / {numRounds}
            </Typography>
            <Typography variant="h5" mb={4} fontWeight="bold" style={{ display: 'flex', alignItems: 'center' }}>
            <span data-testid="question" style={{ marginRight: '1em' }}>{questionData.question}</span>
                <CountdownCircleTimer
                  data-testid="circleTimer"
                  key={questionCountdownKey}
                  isPlaying = {questionCountdownRunning}
                  duration={timerConfig}
                  colors={["#0bfc03", "#F7B801", "#f50707", "#A30000"]}
                  size={100}
                  colorsTime={[10, 6, 3, 0]}
                  onComplete={() => selectResponse(0, "FAILED")} //when time ends always fail question
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
                            data-testid="answer"
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
