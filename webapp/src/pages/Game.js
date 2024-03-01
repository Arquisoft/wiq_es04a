import * as React from 'react';
import { Container, CssBaseline, Button, Grid, Typography, CircularProgress } from '@mui/material';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();

    // state game initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState({});
    const [shouldRedirect, setShouldRedirect] = React.useState(false);

    // state to accumulate game statistics
    const [gameStatistics, setGameStatistics] = React.useState({
        correctlyAnswered: 0,
        incorrectlyAnswered: 0,
        totalScore: 0,
    });

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        const updateUserGameData = async () => {
            if (round <= 3) {
                await startNewRound();
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
    
        updateUserGameData();
    }, [round, gameStatistics]);

    // selects a random question from the data and initializes button states for the selected question
    const startNewRound = () => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestionData(questions[randomIndex]);
        setButtonStates(new Array(questions[randomIndex].options.length).fill(null));
    };

    // this function is called when a user selects a response. It checks if the selected response is correct and updates button states accordingly.
    const selectResponse = async (index, response) => {
        const newButtonStates = { ...buttonStates };

        if (response === questionData.correctAnswer) {
            for (let i = 0; i < questionData.options.length; i++) {
                for (let i = 0; i < questionData.options.length; i++) {
                    if (i === index) {
                        newButtonStates[i] = "success";
                    } else {
                        newButtonStates[i] = "failure";
                    }
                }
            }
            // Update game statistics for correct answer
            setGameStatistics(prevStats => ({
                ...prevStats,
                correctlyAnswered: prevStats.correctlyAnswered + 1,
                totalScore: prevStats.totalScore + 20,
            }));
        } else {
            newButtonStates[index] = "failure";
            // Update game statistics for incorrect answer
            setGameStatistics(prevStats => ({
                ...prevStats,
                incorrectlyAnswered: prevStats.incorrectlyAnswered + 1,
            }));
        }

        setButtonStates(newButtonStates);

         // Add a short pause before moving to the next round
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second pause

        setRound(round + 1);
        setButtonStates({});
    };

    // circular loading, shows while searching for questions
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
                <Typography variant="body2" mt={2}>
                    Loading questions...
                </Typography>
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
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1' }}>
          <CssBaseline />
          <Grid container spacing={2} sx={{ maxWidth: '600px' }}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">{questionData.question}</Typography>
            </Grid>
            {questionData.options.map((option, index) => (
              <Grid item xs={12} key={index} sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => selectResponse(index, option)}
                  disabled={buttonStates[index] !== null}
                  sx={{
                    height: "15vh",
                    width: "100%",
                    borderRadius: "15px",
                    backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                    "&:disabled": {
                      backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                      color: "white"
                    }
                  }}
                >
                  {`${String.fromCharCode(65 + index)}) ${option}`}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      );
}

export default Game;
