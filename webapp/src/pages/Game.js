import * as React from 'react';
import { Container, Button, CssBaseline, Grid, Typography, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
=======
>>>>>>> origin/develop
import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Game = () => {
    const navigate = useNavigate();
    const MAX_ROUNDS = 3;
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const { sessionId, username, isLoggedIn, createSession, destroySession } = useContext(SessionContext);

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [answered, setAnswered] = React.useState(false);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [userData, setUserData] = React.useState({
        username: username,
        total_score: 0,
        correctly_answered_questions: 0,
        incorrectly_answered_questions: 0,
<<<<<<< HEAD
        total_time_played: 3600, 
=======
        total_time_played: 0, 
>>>>>>> origin/develop
        games_played: 1,
    }); 
    const [timerRunning, setTimerRunning] = React.useState(true); // indicate if the timer is working

    // hook to iniciate timer
    React.useEffect(() => {
        let timer;
        if (timerRunning) {
            timer = setInterval(() => {
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    total_time_played: prevUserData.total_time_played + 1
                }));
            }, 1000); 
        }
        return () => clearInterval(timer); 
    }, [timerRunning]);

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        if (round <= MAX_ROUNDS) {
            startNewRound();
        } else {
            setTimerRunning(false);
            setShouldRedirect(true);
        }
    }, [round]);

    // selects a random question from the data and initializes button states for the selected question
    const startNewRound = () => {
        setAnswered(false);
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestionData(questions[randomIndex]);
        setButtonStates(new Array(questions[randomIndex].options.length).fill(null));
    };

    // this function is called when a user selects a response. 
    const selectResponse = async (index, response) => {
        setAnswered(true);
        const newButtonStates = [...buttonStates];

        //check answer
        if (response === questionData.correctAnswer) {
            newButtonStates[index] = "success"
            const sucessSound = new Audio(SUCCESS_SOUND_ROUTE);
            sucessSound.volume = 0.40;
            sucessSound.play();
            setUserData((prevUserData) => ({
                ...prevUserData,
                username: prevUserData.username,
                correctly_answered_questions: prevUserData.correctly_answered_questions + 1,
                total_score: prevUserData.total_score + 20,
            }));
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
            setUserData(prevUserData => ({
                ...prevUserData,
<<<<<<< HEAD
                username: prevUserData.username,
                correctly_answered_questions: prevUserData.correctly_answered_questions,
=======
>>>>>>> origin/develop
                incorrectly_answered_questions: prevUserData.incorrectly_answered_questions + 1,
            }));
        }

        setButtonStates(newButtonStates);

        if (round >= 3) {
            // Update user data before redirecting
            try {
                await axios.post(`${apiEndpoint}/user/edit`, userData);
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
                color: userData.correctly_answered_questions > userData.incorrectly_answered_questions ? 'green' : 'red',
                fontSize: '4rem', // Tamaño de fuente
                marginTop: '20px', // Espaciado superior
                marginBottom: '50px', // Espaciado inferior
            }}
        >
            {userData.correctly_answered_questions > userData.incorrectly_answered_questions ? "Great Job!" : "Game Over"}
        </Typography>
            <div>
                <Typography variant="h6">Correct Answers: {userData.correctly_answered_questions}</Typography>
                <Typography variant="h6">Incorrect Answers: {userData.incorrectly_answered_questions}</Typography>
                <Typography variant="h6">Total money: {userData.total_score}</Typography>
                <Typography variant="h6">Time: {userData.total_time_played} seconds</Typography>
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
                Time: {userData.total_time_played} s
            </Typography>
            <Typography variant='h6' >
                {round} / {MAX_ROUNDS}
            </Typography>
            <Typography variant="h5" mb={2}>
                {questionData.question}
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