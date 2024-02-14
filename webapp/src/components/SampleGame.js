import { Box, Container, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import React, { useState } from 'react';
import Navbar from './navBar';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const questions = [
    {
      id: 1,
      question: '¿Cuál es la capital de Francia?',
      options: ['Roma', 'Madrid', 'París', 'Londres'],
      correctAnswer: 'París',
    },
    {
      id: 2,
      question: '¿Cuál es la capital de Asturias?',
      options: ['Llanes', 'Avilés', 'Gijón', 'Oviedo'],
      correctAnswer: 'Oviedo',
    },
  ];

const Game = () => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
  
    const handleAnswerChange = (event) => {
      setSelectedAnswer(event.target.value);
    };
  
    const handleNextQuestion = () => {
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
  
      setSelectedAnswer('');
      setCurrentQuestion(currentQuestion + 1);
    };
  
    const resetGame = () => {
      setCurrentQuestion(0);
      setSelectedAnswer('');
      setScore(0);
    };

    return(
        <Box>
            <Navbar/>
            <Container>
                <Typography variant="h2" style={{ fontFamily: 'inherit', textAlign: 'center', marginTop: '0.2em' }} >
                    Juego simple
                    <VideogameAssetIcon style={{ fontSize: 70, verticalAlign: 'middle', marginLeft: '0.1em'}}/>
                </Typography>

                <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: '1.5em' }}>
                {currentQuestion < questions.length ? (
                    <div>
                    <Typography variant="h4" style={{ fontFamily: 'inherit', marginBottom: '20px', textAlign: 'center' }}>
                        Pregunta {currentQuestion + 1}:
                    </Typography>
                    <Typography variant="h5" style={{ fontFamily: 'inherit', marginBottom: '20px', textAlign: 'center' }}>
                        {questions[currentQuestion].question}
                    </Typography>
                    <Box style={{display: 'flex', flexDirection: 'column',}}>
                        <FormControl component="fieldset">
                            <RadioGroup
                            aria-label="options"
                            name="options"
                            value={selectedAnswer}
                            onChange={handleAnswerChange}
                            >
                            {questions[currentQuestion].options.map((option, index) => (
                                <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio />}
                                label={option}
                                />
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextQuestion}
                        >
                            Siguiente
                        </Button>
                        </Box>
                    </div>
                ) : (
                    <div>
                    <Typography variant="h4" style={{ fontFamily: 'inherit', marginBottom: '20px' }}>
                        Juego terminado
                    </Typography>
                    <Typography variant="h5" style={{ fontFamily: 'inherit', marginBottom: '20px' }}>
                        Puntuación: {score} de {questions.length}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={resetGame}>
                        Reiniciar Juego
                    </Button>
                    </div>
                )}
                </Container>

            </Container>
        </Box>
    )
}

export default Game;