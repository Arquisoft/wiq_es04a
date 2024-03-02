import * as React from 'react';
import { Container, Button, CssBaseline, Grid, Typography, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [userData, setUserData] = React.useState({
        username: "Samu11", //change it
        total_score: 0,
        correctly_answered_questions: 0,
        incorrectly_answered_questions: 0,
        total_time_played: 0, 
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
        if (round <= 3) {
            startNewRound();
        } else {
            setTimerRunning(false);
            setShouldRedirect(true);
        }
    }, [round]);

    // selects a random question from the data and initializes button states for the selected question
    const startNewRound = () => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestionData(questions[randomIndex]);
        setButtonStates(new Array(questions[randomIndex].options.length).fill(null));
    };

    // this function is called when a user selects a response. 
    const selectResponse = async (index, response) => {
        const newButtonStates = [...buttonStates];

        //check answer
        if (response === questionData.correctAnswer) {
            newButtonStates[index] = "success"
            setUserData((prevUserData) => ({
                ...prevUserData,
                correctly_answered_questions: prevUserData.correctly_answered_questions + 1,
                total_score: prevUserData.total_score + 20,
            }));
        } else {
            newButtonStates[index] = "failure";
            for (let i = 0; i < questionData.options.length; i++) {
                if (questionData.options[i] === questionData.correctAnswer) {
                    newButtonStates[i] = "success";
                }
            }
            setUserData(prevUserData => ({
                ...prevUserData,
                incorrectly_answered_questions: prevUserData.incorrectly_answered_questions + 1,
            }));
        }

        setButtonStates(newButtonStates);

        if (round >= 3) {
            // Update user data before redirecting
            try {
                const response = await fetch('/user/edit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (response.ok) {
                    console.log('User data updated successfully');
                } else {
                    console.error('Failed to update user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating user data:', error);
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
            <Typography variant="h5" mb={2}>
                {questionData.question}
            </Typography>
            <Grid container spacing={2}>
                {questionData.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                        <Button
                            variant="contained"
                            onClick={() => selectResponse(index, option)}
                            disabled={buttonStates[index] !== null}
                            sx={{
                                height: "50px", // Ajusta el tamaño según sea necesario
                                width: "50%", // Ajusta el ancho según sea necesario
                                borderRadius: "20px", // Ajusta el radio según sea necesario
                                margin: "5px",
                                backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                                "&:disabled": {
                                    backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
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