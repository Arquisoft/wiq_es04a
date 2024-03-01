import * as React from 'react';
import { Container, Button, Grid, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useHistory } from 'react-router-dom';
import questions from "../data/__questions.json"; //static questions battery, we have to change it

const Game = () => {
    const history = useHistory(); // initialize the history object (use)

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        if (round <= 3) { //number of rounds
            startNewRound();
        } else {
            // change and add statics to print like time, good answers, etc
            console.log("Game Over");
            // redirect to '/' after completing rounds
            history.push('/');
        }
    }, [round]);

    // selects a random question from the data and initializes button states for the selected question
    const startNewRound = () => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestionData(questions[randomIndex]);
        setButtonStates(new Array(questions[randomIndex].options.length).fill(null));
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

    if (!questionData) {
        return <div>Loading...</div>; // Show a loading message while data is being fetched
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <CssBaseline />
            <Typography variant="h5" align="center" mb={2}>
                {questionData.question}
            </Typography>
            <Grid container spacing={2}>
                {questionData.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                        <Button
                            variant="contained"
                            onClick={() => selectResponse(index, option)}
                            disabled={buttonStates[index] !== null} // Disable the button once its state has been established
                            sx={{
                                height: "15vh", width: "100%", backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                                "&:disabled": { // Apply color to the disabled button
                                    backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                                    color: "white"
                                }
                            }}
                        >
                            {`${String.fromCharCode(65 + index)}) ${option}`} {/* Convert the index to a letter (A, B, C, ...) */}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Game;
