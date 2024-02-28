const express = require('express');
const router = express.Router();
const dbService = require('../services/question-data-service');
const { readFromFile, getRandomEntity, getProperties, shuffleArray } = require('../utils/cityPopulation');
const { db } = require('../services/question-data-model');

// Manejo de la ruta '/question'
router.get('/', async (_req, res) => {
    try {
        const json = await readFromFile("../questions/utils/question.json");

        const questions = [];
        var entity = json[0].city;
        //entity = json[1].football;
      
        for (let i = 0; i < 5; i++) {
            // get data for selected entity
            //var pos = Math.floor(Math.random() * entity.properties.length);
            // TODO: differenciate cases where the propierty we are looking for is data or another entity
            var pos = 0;
            var instance = entity.instance;
            var property = entity.properties[pos].property;
            var question = entity.properties[pos].template;
            var category = entity.properties[pos].category[0];

            var [entityName, searched_property] = await getRandomEntity(instance, property);
    
            if (searched_property !== null) {
                console.log(entityName, searched_property);
                //const questionText = question + entityName.charAt(0).toUpperCase() + entityName.slice(1) +`?`;
                const questionText = question.replace('x',entityName.charAt(0).toUpperCase() + entityName.slice(1)) +`?`;
                const correctAnswer = searched_property;
    
                // options will contain 3 wrong answers plus the correct one
                const options = await getProperties(property);
                options.push(correctAnswer);

                // Shuffle options, we will not know where is the correct option
                const shuffledOptions = shuffleArray(options);
  
                // Create object with data for the question
                const newQuestion = {
                    question: questionText,
                    options: shuffledOptions,
                    correctAnswer: correctAnswer,
                    category: category
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