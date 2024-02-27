import * as React from 'react';
import { Container, Button, Grid, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import questions from "../data/__questions.json";

const Game = () => {
    const [questionData, setQuestionData] = React.useState(null);

    React.useEffect(() => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestionData(questions[randomIndex]);
    }, []);

    if (!questionData) {
        return <div>Cargando...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
    }

    
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex:'1' }}>
            <CssBaseline />
            <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h5" align="center">{ questionData["question"] }</Typography>
            </Grid>
            {questionData["options"].map((option, index) => (
                    <Grid item xs={6} key={index}>
                        <Button variant="contained" href="/instructions" sx={{ height: "15vh", width: "100%" }}>
                            {`${String.fromCharCode(65 + index)}) ${option}`} {/* Convierte el índice a letra (A, B, C, ...) */}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Game;