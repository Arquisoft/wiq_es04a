const express = require('express');
const router = express.Router();
const dbService = require('../services/question-data-service');
const { getRandomCity, getCitiesPopulation, shuffleArray } = require('../utils/cityPopulation');
const { db } = require('../services/question-data-model');

// Manejo de la ruta '/question'
router.get('/', async (_req, res) => {
    try {
        const questions = [];
        
        for (let i = 0; i < 3; i++) {
            const [cityName, population] = await getRandomCity();
    
            if (population !== null) {
                const questionText = `¿What is the population of ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}?`;
                const correctAnswer = population;
    
                // options will contain 3 wrong answers plus the correct one
                const options = await getCitiesPopulation();
                options.push(correctAnswer);

                // Shuffle options, we will not know where is the correct option
                const shuffledOptions = shuffleArray(options);
  
                // Create object with data for the question
                const newQuestion = {
                    question: questionText,
                    options: shuffledOptions,
                    correctAnswer: correctAnswer,
                    category: "not defined yet"
                };
    
                questions.push(newQuestion);
                dbService.addQuestion(newQuestion);
            }
        }
    
        res.json(questions);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Enter in this url to load sample questions to db: http://localhost:8010/questions/loadSampleData
router.get('/loadSampleData', async (_req, res) => {
    dbService.addTestData();
});

//Get random questions from db: http://localhost:8010/questions/getQuestionsFromDb/3
router.get('/getQuestionsFromDb/:n', async(_req, res) => {
    const n = parseInt(_req.params.n, 10);

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }

    questions = await dbService.getRandomQuestions(n);
    res.json(questions);
});

//Get random questions from db with category filter: http://localhost:8010/questions/getQuestionsFromDb/2/Geografía
router.get('/getQuestionsFromDb/:n/:category', async(_req, res) => {
    const n = parseInt(_req.params.n, 10);
    const category = _req.params.category;

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }

    questions = await dbService.getRandomQuestionsByCategory(n, category);
    res.json(questions);
});

module.exports = router;
