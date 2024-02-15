import { Box, Container, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import React, { useState, useEffect } from 'react';
import Navbar from './navBar';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const Game = () => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);

    const[questions, setQuestions] = useState([]);

    const loadQuestions = async () => {
        await fetch('http://localhost:8000/question')
          .then(response => response.json())
          .then(data => setQuestions(data))
          .catch(error => console.error('Error al cargar las preguntas:', error));
      };
    
    useEffect(() => {
        loadQuestions();
      }, []);

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
  
    const resetGame = async () => {
      await loadQuestions();
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

                <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: '1.5em',
                         padding: '20px', border: "1px solid #ccc", borderRadius: '10px', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                         maxInlineSize: '300px',  maxBlockSize: '430px' }}>
                {currentQuestion < questions.length ? (
                    <div>
                    <Typography variant="h4" style={{ fontFamily: 'inherit', marginBottom: '20px', textAlign: 'center' }}>
                        Pregunta {currentQuestion + 1}:
                    </Typography>
                    <Typography variant="h5" style={{ fontFamily: 'inherit', marginBottom: '20px', textAlign: 'center' }}>
                        {questions[currentQuestion].question}
                    </Typography>
                    <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
                            style={{marginTop: '0.8em'}}
                        >
                            Siguiente
                        </Button>
                        </Box>
                    </div>
                ) : (
                    <div>
                    <Typography variant="h4" style={{ fontFamily: 'inherit', marginBottom: '20px', textAlign: 'center' }}>
                        Juego terminado
                    </Typography>
                    <Typography variant="h5" style={{ fontFamily: 'inherit', marginBottom: '20px', textAlign: 'center' }}>
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