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
        const json = await utils.readFromFile("../questions/utils/questions.json");
        for (let i = 0; i < n; i++) {
            //Gets random template
            const randomIndex = Math.floor(Math.random() * json.length);
            const entity = json[randomIndex];

            // get data for selected entity
            const pos = Math.floor(Math.random() * entity.properties.length);
           
            const property = entity.properties[pos].property[0];
            const question = entity.properties[pos].template[0].question;
            const categories = entity.properties[pos].category;
            const filter = entity.properties[pos].filter;
            const lang = 0 ; //english
            const language = entity.properties[pos].template[lang].lang;

            //let [entityName, searched_property] = await wikidataService.getRandomEntity(instance, property, filter);
            let [entityName, searched_property] = await wikidataService.getRandomEntity(entity, pos, lang);

            if (searched_property !== null) {
                //This way we can ask questions with different structures
                const questionText = question.replace('x',entityName.charAt(0).toUpperCase() + entityName.slice(1)) +`?`;
                let correctAnswer = searched_property;
    
                // options will contain 3 wrong answers plus the correct one
                let options = await wikidataService.getProperties(property, language, filter);
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

                //This code was here and it crashed the generator after first iteration
                //randomIndex = Math.floor(Math.random() * json.length);
                //entity = json[randomIndex];
            }
        }
    } catch (error) {
        console.error("Error generating questions: ", error.message);
    }
}

//Get random question from db and deleting it, adding questions if there are less than 10: http://localhost:8010/questions
router.get('/', async (req, res) => {
    if (await dbService.getQuestionCount() < 10) {
        //Must generate 2 questions
        await generateQuestions(2);
        //Do not wait to generate the others
        generateQuestions(8);
    }
    const question = await dbService.getQuestion();
    res.json(question);

    dbService.deleteQuestionById(question._id);
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

module.exports = router, generateQuestions;
