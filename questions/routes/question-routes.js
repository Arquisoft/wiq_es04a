const express = require('express');
const dbService = require('../services/question-data-service');
const generateQuestionsService = require('../services/generate-questions-service');
const router = express.Router();


//Get random question from db and deleting it, adding questions if there are less than 10: http://localhost:8010/questions
router.get('/', async (req, res) => {
    if (await dbService.getQuestionCount() < 10) {
        //Must generate 2 questions
        await generateQuestionsService.generateQuestions(2);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(8);
    }
    const question = await dbService.getQuestion();
    res.json(question);

    dbService.deleteQuestionById(question._id);
});

//Get random questions from db: http://localhost:8010/questions/getQuestionsFromDb/3
router.get('/getQuestionsFromDb/:n', async(_req, res) => {
    const n = parseInt(_req.params.n, 10);

    if (await dbService.getQuestionCount() < n) {
        //Must generate 2 questions
        await generateQuestionsService.generateQuestions(2);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(8);
    }
 
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
    
    if (await dbService.getQuestionCount() < n) {
        //Must generate 2 questions
        await generateQuestionsService.generateQuestions(2);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(8);
    }

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }

    questions = await dbService.getRandomQuestionsByCategory(n, category);
    res.json(questions);
});

module.exports = router;
