import * as React from 'react';
import { Container, Button, CssBaseline, Grid, Typography, CircularProgress } from '@mui/material';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';

const Game = () => {
    const navigate = useNavigate();

    //sesion information
    const { sessionId, username, isLoggedIn, createSession, destroySession } = useContext(SessionContext);

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [userData, setUserData] = React.useState({
        username: `${username}`, 
        total_score: 0,
        correctly_answered_questions: 0,
        incorrectly_answered_questions: 0,
        total_time_played: 3600, 
        games_played: 1,
    });

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        if (round <= 3) {
            startNewRound();
        } else {
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
            for (let i = 0; i < questionData.options.length; i++) {
                if (i === index) {
                    newButtonStates[i] = "success";
                }
            }
            setUserData((prevUserData) => ({
                ...prevUserData,
                correctly_answered_questions: prevUserData.correctly_answered_questions + 1,
                incorrectly_answered_questions: prevUserData.incorrectly_answered_questions,
                total_score: prevUserData.total_score + 20,
                games_played: prevUserData.games_played,
            }));
        } else {
            newButtonStates[index] = "failure";
            setUserData(prevUserData => ({
                ...prevUserData,
                correctly_answered_questions: prevUserData.correctly_answered_questions,
                incorrectly_answered_questions: prevUserData.incorrectly_answered_questions + 1,
                total_score: prevUserData.total_score,
                games_played: prevUserData.games_played,
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
        navigate('/');
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
            <p>Game Over</p>
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
                            {option}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Game;