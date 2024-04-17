import * as React from 'react';
import axios from 'axios';
import { useTheme, Container, Button, CssBaseline, Grid, Typography, CircularProgress, Card } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import { useContext } from 'react';
import Confetti from 'react-confetti';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Game = () => {
    const navigate = useNavigate();
    const MAX_ROUNDS = 10;
    const SUCCESS_SOUND_ROUTE = "/sounds/success_sound.mp3";
    const FAILURE_SOUND_ROUTE = "/sounds/wrong_sound.mp3";

    //sesion information
    const {username} = useContext(SessionContext);

    // Translations
    const { t } = useTranslation();

    const theme = useTheme();

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
    const [questionCountdownKey, setQuestionCountdownKey] = React.useState(15); //key to update question timer
    const [questionCountdownRunning, setQuestionCountdownRunning] = React.useState(false); //property to start and stop question timer
    const [userResponses, setUserResponses] = React.useState([]);
    const [paused, setPaused] = React.useState(false);
    const [passNewRound, setPassNewRound] = React.useState(false);

    const [questionHistorial, setQuestionHistorial] = React.useState(Array(MAX_ROUNDS).fill(null));

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
        if (round <= MAX_ROUNDS) {
            startNewRound();
            setQuestionCountdownRunning(true);
            setQuestionCountdownKey(questionCountdownKey => questionCountdownKey + 1); //code to reset countdown timer
        } else {
            setTimerRunning(false);
            setShouldRedirect(true);
            setQuestionCountdownRunning(false); // Isnt this redundant as it is stablished when answering?
            updateStatistics();
            updateQuestionsRecord();
        }
        // eslint-disable-next-line
    }, [round]);

    // stablish if the confetti must show or not
    React.useEffect(() => {
        correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? setShowConfetti(true) : setShowConfetti(false);
    }, [correctlyAnsweredQuestions, incorrectlyAnsweredQuestions]);

    React.useEffect(() => {
        if (passNewRound && !paused) {
            setRound(prevRound => {
                return prevRound + 1;
            });
            setButtonStates([]);
        }
    }, [paused, passNewRound]);

    // gets a random question from the database and initializes button states to null
    const startNewRound = async () => {
        setAnswered(false);
        axios.get(`${apiEndpoint}/questions`)
        .then(quest => {
            // every new round it gets a new question from db
            setQuestionData(quest.data);    
            setButtonStates(new Array(quest.data.options.length).fill(null));
        }).catch(error => {
            console.error(error);
        });
    };

    const updateStatistics = async() => {
        try {
            await axios.post(`${apiEndpoint}/statistics/edit`, {
                username:username,
                the_callenge_earned_money:totalScore,
                the_callenge_correctly_answered_questions:correctlyAnsweredQuestions,
                the_callenge_incorrectly_answered_questions:incorrectlyAnsweredQuestions,
                the_callenge_total_time_played:totalTimePlayed,
                the_callenge_games_played:1,
                wise_men_stack_earned_money: 0,
                wise_men_stack_correctly_answered_questions: 0,
                wise_men_stack_incorrectly_answered_questions: 0,
                wise_men_stack_games_played: 0,
                warm_question_earned_money: 0,
                warm_question_correctly_answered_questions: 0,
                warm_question_incorrectly_answered_questions: 0,
                warm_question_passed_questions: 0,
                warm_question_games_played: 0,
                discovering_cities_earned_money: 0,
                discovering_cities_correctly_answered_questions: 0,
                discovering_cities_incorrectly_answered_questions: 0,
                discovering_cities_games_played: 0,
                online_earned_money: 0,
                online_correctly_answered_questions: 0,
                online_incorrectly_answered_questions: 0,
                online_total_time_played: 0,
                online_games_played: 0,
                online_games_won: 0
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    const updateQuestionsRecord = async() => {
        try {
            await axios.post(`${apiEndpoint}/user/questionsRecord`, {
                questions: userResponses,
                username: username,
                gameMode: "TheChallenge"
            });
        } catch (error) {
            console.error("Error:", error);
        };
    }

    const handlePassQuestion = () => {
        setAnswered(true);
        const newButtonStates = [...buttonStates];

        setQuestionCountdownRunning(false);
        
        const userResponse = {
            question: questionData.question,
            response: "",
            options: questionData.options,
            correctAnswer: questionData.correctAnswer
        };
        setUserResponses(prevResponses => [...prevResponses, userResponse]);

        const failureSound = new Audio(FAILURE_SOUND_ROUTE);
        failureSound.volume = 0.40;
        failureSound.play();
        for (let i = 0; i < questionData.options.length; i++) {
            if (questionData.options[i] === questionData.correctAnswer) {
                newButtonStates[i] = "success";
            }
        }
        setIncorrectlyAnsweredQuestions(incorrectlyAnsweredQuestions + 1);
        setTotalScore(totalScore - 10);

        const newQuestionHistorial = [...questionHistorial];
        newQuestionHistorial[round-1] = false;
        setQuestionHistorial(newQuestionHistorial);

        setButtonStates(newButtonStates);

        setTimeout(async() => {
            setPassNewRound(true);
        }, 4000);
    };
    

    // this function is called when a user selects a response. 
    const selectResponse = async (index, response) => {
        setAnswered(true);
        const newButtonStates = [...buttonStates];

        setQuestionCountdownRunning(false);

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
            setTotalScore(totalScore + 100);

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
            setTotalScore(totalScore - 10);

            const newQuestionHistorial = [...questionHistorial];
            newQuestionHistorial[round-1] = false;
            setQuestionHistorial(newQuestionHistorial);
        }

        setButtonStates(newButtonStates);

        setTimeout(async() => {
            setPassNewRound(true);
        }, 4000);
    };

    const questionHistorialBar = () => {
        return questionHistorial.map((isCorrect, index) => (
            <Card sx={{ width: `${100 / MAX_ROUNDS}%`,
             padding:'0.2em', 
             margin:'0 0.1em', 
             backgroundColor: isCorrect === null ? 'gray' : isCorrect ? theme.palette.success.main : theme.palette.error.main }}
            >
            </Card>
        ));
    };    

    const togglePause = () => {
        setTimerRunning(!timerRunning);
        setPaused(!paused);
    }

    // circular loading
    if (!questionData) {
        return (
            <Container
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flex: '1'
                }}
            >
                <CssBaseline />
                <CircularProgress />
            </Container>
        );
    }

    // redirect to / if game over 
    if (shouldRedirect) {
        // Redirect after 4 seconds
        setTimeout(() => {
            navigate('/homepage');
        }, 4000);


        return (
            <Container
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '5em',
                    textAlign: 'center',
                    flex: '1'
                }}
            >
                <CssBaseline />
                <Typography variant="h2" data-testid="end-game-message"
                        sx={{ color: correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? theme.palette.success.main : theme.palette.error.main }}>
                    {correctlyAnsweredQuestions > incorrectlyAnsweredQuestions ? t("Game.win_msg") : t("Game.lose_msg") }
                </Typography>
                <Container>
                    <Typography variant="h4">{ t("Game.correct") }: {correctlyAnsweredQuestions}</Typography>
                    <Typography variant="h4">{ t("Game.incorrect") }: {incorrectlyAnsweredQuestions}</Typography>
                    <Typography variant="h4">{ t("Game.money") }: {totalScore}</Typography>
                    <Typography variant="h4">{ t("Game.time") }: {totalTimePlayed}</Typography>
                </Container>
                {showConfetti && <Confetti />}
            </Container>
        );
    }

    return (
        <Container
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center', 
                textAlign: 'center',
                flex: '1',
                gap: '2em',
                margin: '2em auto 1em',
            }}
        >
            <CssBaseline />

            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                { answered ?
                    // Pausa
                    <Button variant="contained" onClick={() => togglePause()} sx={{ height: 100, width: 100, borderRadius: '50%' }} data-testid={ paused ? "play" : "pause"}>
                        { paused ? <PlayArrow /> : <Pause /> }
                    </Button>
                    :
                    // Cronómetro
                    <CountdownCircleTimer
                        data-testid="circleTimer"
                        key={questionCountdownKey}
                        isPlaying = {questionCountdownRunning}
                        duration={15}
                        colors={[theme.palette.success.main, "#F7B801", "#f50707", theme.palette.error.main]}
                        size={100}
                        colorsTime={[10, 6, 3, 0]}
                        onComplete={() => selectResponse(-1, "FAILED")} //when time ends always fail question
                        >
                        {({ remainingTime }) => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{remainingTime}</div>
                            </div>
                            );
                        }}
                    </CountdownCircleTimer>
                }
            </Container>

            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography variant="h4" data-testid="question" sx={{ fontWeight:'bold', marginBottom:'0.7em' }} >
                    {questionData.question.toUpperCase()}
                </Typography>

                <Grid container spacing={2}>
                    {questionData.options.map((option, index) => (
                        <Grid item xs={12} key={index}>
                            <Button
                                data-testid={buttonStates[index] === "success" ? `success${index}` : buttonStates[index] === "failure" ? `failel${index}` : `answer${index}`}
                                variant="contained"
                                onClick={() => selectResponse(index, option)}
                                disabled={buttonStates[index] !== null || answered} // before, you could still press more than one button
                                sx={{
                                    height: "3.3em",
                                    width: "50%",
                                    borderRadius: "10px",
                                    margin: "5px",
                                    "&:disabled": {
                                        backgroundColor: buttonStates[index] === "success" ? theme.palette.success.main : buttonStates[index] === "failure" ? theme.palette.error.main : "gray",
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

            {!answered && (
                <Button
                    variant="contained"
                    onClick={handlePassQuestion}
                    sx={{ height: "3.3em", width: "50%", borderRadius: "10px", margin: "5px" }}
                >
                    {"Pass"}
                </Button>
)}

            {/* Progress Cards */}
            <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop:'2em' }} >
                {questionHistorialBar()}
            </Container>
        </Container>
    );
};

export default Game;
