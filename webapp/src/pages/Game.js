import * as React from 'react';
import { Container, Button, Grid, Typography, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import questions from "../data/__questions.json"; //static questions battery, we have to change it
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        if (round <= 3) {
            setLoading(true); // Set loading to true when initiating a new round
            startNewRound();
        } else {
            // set shouldRedirect to true after a 3-second delay to trigger redirection
            setTimeout(() => {
                setShouldRedirect(true);
            }, 3000);
        }
    }, [round]);

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
                    newButtonStates[i] = "success";
                } else {
                    newButtonStates[i] = "failure";
                }
            }
        } else {
            newButtonStates[index] = "failure";
        }

        setButtonStates(newButtonStates);

        // add a short pause before moving to the next round
        setTimeout(() => {
            setRound(round + 1);
            setButtonStates([]);
        }, 2000); // 2 second pause
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

    // prints 'Game Over' on the screen before redirecting if game over
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
                <Typography variant="h5" mb={2}>
                    Game Over
                </Typography>
                {/* Display your game result statistics here */}
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
