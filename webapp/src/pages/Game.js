import * as React from 'react';
import { Container, Button, Grid, Typography, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();

    // state game initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // state to accumulate game statistics
    const [gameStatistics, setGameStatistics] = React.useState({
        correctlyAnswered: 0,
        incorrectlyAnswered: 0,
        totalScore: 0,
    });

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        const fetchData = async () => {
            if (round <= 3) {
                startNewRound();
            } else {
                // Prepare data for the /edit endpoint
                const userData = {
                    username: "Samu11", // Replace with the actual username
                    total_score: gameStatistics.totalScore,
                    correctly_answered_questions: gameStatistics.correctlyAnswered,
                    incorrectly_answered_questions: gameStatistics.incorrectlyAnswered,
                    total_time_played: 300, // Replace with the actual time
                    games_played: 1,
                };

                try {
                    // Send a POST request to update user data
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
                        console.error('Failed to update user data');
                    }

                    setShouldRedirect(true);
                } catch (error) {
                    console.error('Error while updating user data:', error);
                }
            }
        };

        fetchData(); // Call the async function
    }, [round, gameStatistics]);

    // selects a random question from the data and initializes button states for the selected question
    const startNewRound = () => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        // Simulate a delay for loading the question (you can replace this with your actual data fetching logic)
        setTimeout(() => {
            setQuestionData(questions[randomIndex]);
            setButtonStates(new Array(questions[randomIndex].options.length).fill(null));
            setLoading(false); // Set loading to false when the question is loaded
        }, 2000); // Simulated 2-second delay
    };

    // this function is called when a user selects a response. It checks if the selected response is correct and updates button states accordingly.
    const selectResponse = (index, response) => {
        const newButtonStates = [...buttonStates];
        if (response === questionData.correctAnswer) {
            for (let i = 0; i < questionData.options.length; i++) {
                if (i === index) {
                    newButtonStates[i] = "success"; // Change to "contained" for correct answer
                } else {
                    newButtonStates[i] = "failure"; // Change to "outlined" for incorrect answers
                }
            }
            // Update game statistics for correct answer
            setGameStatistics(prevStats => ({
                ...prevStats,
                correctlyAnswered: prevStats.correctlyAnswered + 1,
                totalScore: prevStats.totalScore + 20,
            }));
        } else {
            newButtonStates[index] = "failure"; // Change to "outlined" for incorrect answers
            // Update game statistics for incorrect answer
            setGameStatistics(prevStats => ({
                ...prevStats,
                incorrectlyAnswered: prevStats.incorrectlyAnswered + 1,
            }));
        }

        setButtonStates(newButtonStates);

        // add a short pause before moving to the next round
        setTimeout(() => {
            setRound(round + 1);
            setButtonStates([]);
        }, 2000); // 2-second pause
    };

    // circular loading
    if (loading) {
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
        return null; // Avoid rendering anything else after the redirection
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
                            variant={buttonStates[index] === "success" ? "contained" : "outlined"} // Use "contained" for correct answers, "outlined" for incorrect answers
                            onClick={() => selectResponse(index, option)}
                            disabled={buttonStates[index] !== null}
                            sx={{
                                height: "50px",
                                width: "50%",
                                borderRadius: "20px",
                                margin: "5px",
                                backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                                color: "white",
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
