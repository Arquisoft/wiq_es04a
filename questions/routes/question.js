const express = require('express');
const router = express.Router();
const dbService = require('../services/question-data-service');
const utils = require('../utils/generalQuestions');
const wikidataService = require('../services/wikidata-service');

// Manejo de la ruta '/question'
router.get('/', async (_req, res) => {
    try {
        const json = await utils.readFromFile("../questions/utils/question.json");

        const questions = [];
        //Gets random template
        const randomIndex = Math.floor(Math.random() * json.length);
        var entity = json[randomIndex];
        //var entity = json[0];
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

            var [entityName, searched_property] = await wikidataService.getRandomEntity(instance, property);
    
            if (searched_property !== null) {
                //const questionText = question + entityName.charAt(0).toUpperCase() + entityName.slice(1) +`?`;
                //This way we can ask questions with different structures
                const questionText = question.replace('x',entityName.charAt(0).toUpperCase() + entityName.slice(1)) +`?`;
                let correctAnswer = searched_property;
    
                // options will contain 3 wrong answers plus the correct one
                let options = await wikidataService.getProperties(property);
                options.push(correctAnswer);

                //If properties are entities
                if(correctAnswer.startsWith("http:")) {
                    options = await wikidataService.convertUrlsToLabels(options);
                    //before shuffle correct answer is last one
                    correctAnswer = options[3];
                }

                // Shuffle options, we will not know where is the correct option
                const shuffledOptions = utils.shuffleArray(options);
                
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
