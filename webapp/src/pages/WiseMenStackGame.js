import * as React from 'react';
import axios from 'axios';
import { Container, Box, Button, CssBaseline, Grid, Typography, CircularProgress, Card, CardContent, Select, MenuItem, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import Confetti from 'react-confetti';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useTranslation } from 'react-i18next';
import i18n from '../localize/i18n';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const WiseMenStackGame = () => {
    const navigate = useNavigate();
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const {username} = useContext(SessionContext);
    const theme = useTheme();


    // Traductions
    const { t } = useTranslation();

    // state initialization
    const [round, setRound] = React.useState(1);
    const [questionData, setQuestionData] = React.useState(null);
    const [buttonStates, setButtonStates] = React.useState([]);
    const [answered, setAnswered] = React.useState(false);
    const [shouldRedirect, setShouldRedirect] = React.useState(false);
    const [totalScore, setTotalScore] = React.useState(0);
    const [correctlyAnsweredQuestions, setCorrectlyAnsweredQuestions] = React.useState(0);
    const [incorrectlyAnsweredQuestions, setIncorrectlyAnsweredQuestions] = React.useState(0);
    const [totalTimePlayed, setTotalTimePlayed] = React.useState(0);
    const [timerRunning, setTimerRunning] = React.useState(true); // indicate if the timer is working
    const [showConfetti, setShowConfetti] = React.useState(false); //indicates if the confetti must appear
    const [questionCountdownKey, ] = React.useState(60); //key to update question timer
    const [questionCountdownRunning, setQuestionCountdownRunning] = React.useState(false); //property to start and stop question timer
    const [userResponses, setUserResponses] = React.useState([]);
    const [language, setCurrentLanguage] = React.useState(i18n.language);

    const [category, setCategory] = React.useState('Geography');
    const [possibleAnswers, setPossibleAnswers] = React.useState([]);
    const [isConfigured, setConfiguration] = React.useState(false);

    const [questionHistorial, setQuestionHistorial] = React.useState(Array(round).fill(null));

    React.useEffect(() => {
        let timer;
        if (timerRunning) {
            timer = setInterval(() => {
                setTotalTimePlayed((prevTotalTime) => prevTotalTime + 1);
            }, 1000);
        }
    
        return () => clearInterval(timer);
    }, [timerRunning]);

    // hook to initiating new rounds if the current number of rounds is less than or equal to 3 
    React.useEffect(() => {
        if (totalTimePlayed <= questionCountdownKey) {
            startNewRound();
            setQuestionCountdownRunning(true);
        } else {
            setTimerRunning(false);
            setShouldRedirect(true);
            setQuestionCountdownRunning(false);
            updateStatistics();
            updateQuestionsRecord();
        }
        // eslint-disable-next-line
    }, [round]);

    // stablish if the confetti must show or not
    React.useEffect(() => {
        if (correctlyAnsweredQuestions > incorrectlyAnsweredQuestions) {
          setShowConfetti(true);
        } else {
          setShowConfetti(false);
        }
      }, [correctlyAnsweredQuestions, incorrectlyAnsweredQuestions]);
    

    // gets a random question from the database and initializes button states to null
    const startNewRound = async () => {
        setAnswered(false);
        // It works deploying using git repo from machine with: axios.get(`http://20.80.235.188:8000/questions`)7
        
        // Updates current language
        setCurrentLanguage(i18n.language);
        axios.get(`${apiEndpoint}/questions/${language}/${category}`)
        .then(quest => {
            // every new round it gets a new question from db
            setQuestionData(quest.data[0]);
            setButtonStates(new Array(2).fill(null));
            getPossibleOptions(quest.data[0]);

        }).catch(error => {
            console.error("Could not get questions", error);
        }); 
        
    };

    // It puts 2 possible answers into an array making sure that the correct answer is not repeated
    const getPossibleOptions = async (question) => {
        var options = [];
        options.push(question.correctAnswer);
        let randomNumber ;
        do {
           randomNumber = Math.floor(Math.random() * question.options.length);
        } while (question.options[randomNumber] === question.correctAnswer);
        options.push(question.options[randomNumber]);
        options = shuffleArray(options);
        setPossibleAnswers(options);
    }

    // Shuffles array
    function shuffleArray(array) {
        const random = Math.random();
        const randomFactor = random < 0.5 ? -1 : 1;
        return array.sort(() => randomFactor);
    }
      

    const updateStatistics = async() => {
        try {
            await axios.put(`${apiEndpoint}/statistics`, {
                username:username,
                wise_men_stack_earned_money:totalScore,
                wise_men_stack_correctly_answered_questions:correctlyAnsweredQuestions,
                wise_men_stack_incorrectly_answered_questions:incorrectlyAnsweredQuestions,
                wise_men_stack_games_played:1
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    const updateQuestionsRecord = async() => {
        try {
            await axios.put(`${apiEndpoint}/questionsRecord`, {
                questions: userResponses,
                username: username,
                gameMode: "WiseMenStack"
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    // this function is called when a user selects a response. 
    const selectResponse = async (index, response) => {
        setAnswered(true);
        const newButtonStates = [...buttonStates];

        //setQuestionCountdownRunning(false);

        //check answer
        if (response === questionData.correctAnswer) {
            const userResponse = {
                question: questionData.question,
                response: response,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer
            };
            setUserResponses(prevResponses => [...prevResponses, userResponse]);

            newButtonStates[index] = "success"
            const sucessSound = new Audio(SUCCESS_SOUND_ROUTE);
            sucessSound.volume = 0.40;
            sucessSound.play();
            setCorrectlyAnsweredQuestions(correctlyAnsweredQuestions + 1);
            setTotalScore(totalScore + 20);

            const newQuestionHistorial = [...questionHistorial];
            newQuestionHistorial[round-1] = true;
            setQuestionHistorial(newQuestionHistorial);
        } else {
            const userResponse = {
                question: questionData.question,
                response: response,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer
            };
            setUserResponses(prevResponses => [...prevResponses, userResponse]);
            newButtonStates[index] = "failure";
            const failureSound = new Audio(FAILURE_SOUND_ROUTE);
            failureSound.volume = 0.40;
            failureSound.play();
            for (let i = 0; i < questionData.options.length; i++) {
                if (questionData.options[i] === questionData.correctAnswer) {
                    newButtonStates[i] = "success";
                }
            }
            setIncorrectlyAnsweredQuestions(incorrectlyAnsweredQuestions + 1);

            const newQuestionHistorial = [...questionHistorial];
            newQuestionHistorial[round-1] = false;
            setQuestionHistorial(newQuestionHistorial);
        }

        setButtonStates(newButtonStates);

        setTimeout(async() => {
            setRound(round + 1);
            setButtonStates([]);
            setCurrentLanguage(i18n.language);
        }, 2000);
    };

    const questionHistorialBar = () => {
        return questionHistorial.map((isCorrect, index) => (
        <Card 
          key={index + 1}
          variant="outlined"
          style={{ 
            width: `${100 / round-1}%`,
            marginRight: '0.6em',
            backgroundColor: isCorrect === null ? 'gray' : isCorrect ? 'lightgreen' : 'salmon',
          }}
        >
          <CardContent>{index + 1}</CardContent>
        </Card>
        ));
    };
    
    if(!isConfigured) {
        return (
            <Container sx={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', gap: '4em' }}>
                <Typography variant="h2" align="center" fontWeight="bold" sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontSize:'3rem' }}>
                    {t("Game.config.title")}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                        <Typography variant="h4" fontWeight="bold" color="error">{t("Wise_Men.instructions1")}</Typography>
                        <Typography variant="h4" fontWeight="bold" color={theme.palette.success.main} >{t("Wise_Men.instructions2")}</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">{t("Wise_Men.instructions3")}</Typography>
                    </Box>

                    {/* Dropdown for selecting category */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                        <Typography data-testid="categories-label" variant='h5' htmlFor="category">
                            {t("Game.config.category")}:
                        </Typography>
                        <Select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            style={{ minWidth: '120px' }}
                        >
                            <MenuItem value="Geography">{t("Game.categories.geography")}</MenuItem>
                            <MenuItem value="Political">{t("Game.categories.political")}</MenuItem>
                            <MenuItem value="Sports">{t("Game.categories.sports")}</MenuItem>
                        </Select>
                    </Box>
                </Box>

                <Button
                    data-testid="start-button"
                    onClick={() => { 
                        setConfiguration(true);
                        startNewRound(); 
                        setQuestionHistorial(Array(round).fill(null));
                    }}
                    variant="contained"
                    size="large"
                    sx={{
                        fontFamily: 'Arial Black, sans-serif',
                        color: theme.palette.primary.main,
                        backgroundColor: 'transparent',
                        border: `2px solid ${theme.palette.primary.main}`,
                        transition: 'background-color 0.3s ease',

                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                        }
                    }}
                >
                    {t("Game.start")}
                </Button>
            </Container>
        );
    }
    
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
                navigate('/homepage');
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
                <Typography 
                data-testid="end-game-message"
                variant="h4" 
                sx={{
                    color: correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? 'green' : 'red',
                    fontSize: '4rem', // Tamaño de fuente
                    marginTop: '20px', // Espaciado superior
                    marginBottom: '50px', // Espaciado inferior
                }}
            >
                {correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? t("Game.win_msg") : t("Game.lose_msg") }
            </Typography>
                <div>
                    <Typography variant="h6">{ t("Game.correct") }: {correctlyAnsweredQuestions}</Typography>
                    <Typography variant="h6">{ t("Game.incorrect") }: {incorrectlyAnsweredQuestions}</Typography>
                    <Typography variant="h6">{ t("Game.money") }: {totalScore}</Typography>
                    <Typography variant="h6">{ t("Game.time") }: {totalTimePlayed}</Typography>
                </div>
                {showConfetti && <Confetti />}
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
            
            <Container
            sx={{
                position: 'absolute',
                top: '10%', 
                right: '20%', 
            }}>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {questionHistorialBar()}
                </Container>
            </Container>

            <Typography variant='h6' data-testid="numRound">
                {t("Game.round")} {round} 
            </Typography>
            <Typography variant="h5" mb={4} fontWeight="bold" style={{ display: 'flex', alignItems: 'center' }}>
            <span data-testid="question" style={{ marginRight: '1em' }}>{questionData.question}</span>
                <CountdownCircleTimer
                  data-testid="circleTimer"
                  key={questionCountdownKey}
                  isPlaying = {questionCountdownRunning}
                  duration={60}
                  colors={["#0bfc03", "#F7B801", "#f50707", "#A30000"]}
                  size={100}
                  colorsTime={[10, 6, 3, 0]}
                  onComplete={() => selectResponse(0, "FAILED")} //when time ends always fail question
                >
                  {({ remainingTime }) => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{remainingTime}</div>
                      </div>
                    );
                  }}
                </CountdownCircleTimer>
            </Typography>

            <Grid container spacing={2}>
                {possibleAnswers.map((option, index) => (
                    <Grid item xs={12} key={index}>
                        <Button
                            data-testid="answer"
                            variant="contained"
                            onClick={() => selectResponse(index, option)}
                            disabled={buttonStates[index] !== null || answered} // before, you could still press more than one button
                            sx={{
                                height: "50px", // Ajusta el tamaño según sea necesario
                                width: "50%", // Ajusta el ancho según sea necesario
                                borderRadius: "20px", // Ajusta el radio según sea necesario
                                margin: "5px",
                                backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : null,
                                "&:disabled": {
                                    backgroundColor: buttonStates[index] === "success" ? "green" : buttonStates[index] === "failure" ? "red" : "gray",
                                    color: "white",
                                },
                            }}
                        >
                            {buttonStates[index] === "success" ? <CheckIcon /> : buttonStates[index] === "failure" ? <ClearIcon /> : null}
                            {option}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default WiseMenStackGame;
