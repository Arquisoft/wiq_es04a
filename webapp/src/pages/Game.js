import * as React from 'react';
import { Container, Button, CssBaseline, Grid, Typography, CircularProgress } from '@mui/material';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);

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
        } else {
            newButtonStates[index] = "failure";
        }

        setButtonStates(newButtonStates);

        if (round >= 3) {
            // Calculate total score
            const correctAnswers = newButtonStates.filter(state => state === "success").length;
            const incorrectAnswers = newButtonStates.filter(state => state === "failure").length;
            const currentScore = correctAnswers === questionData.options.length && incorrectAnswers === 0 ? 20 : 0;
            setTotalScore(totalScore + currentScore);

            // Update user data before redirecting
            try {
                const userData = {
                    username: "Samu11", // change it
                    total_score: totalScore,
                    correctly_answered_questions: correctAnswers,
                    incorrectly_answered_questions: incorrectAnswers,
                    total_time_played: 3600, // change it
                    games_played: 1,
                };

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

        if (round < 3) {
            setTimeout(() => {
                setRound(round + 1);
                setButtonStates([]);
            }, 2000);
        } else {
            setRound(round + 1);
            setButtonStates([]);
        }
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
        }, 3000);

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