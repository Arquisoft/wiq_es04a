const express = require('express');
const dbService = require('../services/question-data-service');
const utils = require('../utils/generalQuestions');
const wikidataService = require('../services/wikidata-service');

const router = express.Router();

/**
 * Asynchronously generates a specified number of questions using data from the JSON file and stores them in the DB.
 * 
 * @param {number} n - The number of questions to generate.
 * @returns {Promise<void>} A Promise that resolves when all questions are generated.
 */
async function generateQuestions(n) {
    try {
        const json = await utils.readFromFile("../questions/utils/question.json");
        for (let i = 0; i < n; i++) {
            //Gets random template
            const randomIndex = Math.floor(Math.random() * json.length);
            const entity = json[randomIndex];

            // get data for selected entity
            const pos = Math.floor(Math.random() * entity.properties.length);
           
            const instance = entity.instance;
            const property = entity.properties[pos].property;
            const question = entity.properties[pos].template;
            const categories = entity.properties[pos].category;

            let [entityName, searched_property] = await wikidataService.getRandomEntity(instance, property);
          
            if (searched_property !== null) {
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
                    categories: categories
                };

                dbService.addQuestion(newQuestion);

                randomIndex = Math.floor(Math.random() * json.length);
                entity = json[randomIndex];
            }
        }
    } catch (error) {
        console.error("Error generating questions: ", error.message);
    }
}

router.get('/', async (req, res) => {
    if (await dbService.getQuestionCount() < 10) {
        await generateQuestions(10);
    }
    const question = await dbService.getQuestion();
    res.json(question);

    //dbService.deleteQuestionById(question._id);
    console.log(await dbService.getQuestionCount());
});

// Manejo de la ruta '/questions/add'
router.get('/add', async (_req, res) => {
    const questions = [];
    
    for (let i = 0; i < 5; i++) {
        const newQuestion = generateQuestions(1);
        questions.push(newQuestion);
        dbService.addQuestion(newQuestion);
    }

    res.json(questions);
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
