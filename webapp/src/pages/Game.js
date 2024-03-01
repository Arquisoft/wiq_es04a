import * as React from 'react';
import { Container, Button, Grid, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import questions from "../data/__questions.json";

const Game = () => {
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);

    React.useEffect(() => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestionData(questions[randomIndex]);
        setButtonStates(new Array(questions[randomIndex].options.length).fill(null));
    }, []);

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
            newButtonStates[index] = "failure"
        }
        
        setButtonStates(newButtonStates);
    };

    if (!questionData) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex:'1' }}>
            <CssBaseline />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center">{ questionData.question }</Typography>
                </Grid>
                {questionData.options.map((option, index) => (
                    <Grid item xs={6} key={index}>
                        <Button 
                            variant="contained" 
                            onClick={() => selectResponse(index, option)} 
                            disabled={buttonStates[index] !== null} // Disables the buttom once it has been stablished its state
                            sx={{ height: "15vh", width: "100%", backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                            "&:disabled": { // Aplica el color al botón deshabilitado
                                backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                                color: "white" }
                            }}
                        >
                            {`${String.fromCharCode(65 + index)}) ${option}`} {/* Convierte el índice a letra (A, B, C, ...) */}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Game;
