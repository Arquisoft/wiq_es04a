const express = require('express');
const dbService = require('../services/question-data-service');
const generateQuestionsService = require('../services/generate-questions-service');
const router = express.Router();


//Get random question from db and deleting it, adding questions if there are less than 10: http://localhost:8010/questions
router.get('/', async (req, res) => {
    const questionCount = await dbService.getQuestionCount();

    // 0: Await till it creates 2, creates 50 async and do not delete
    if (questionCount == 0) {
        await generateQuestionsService.generateQuestions(2);
        generateQuestionsService.generateQuestions(50);
        const question = await dbService.getQuestion();
        res.json(question);
        
    // < 50: async creates 10 and do not delete
    } else if (questionCount < 50) {
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(10);
        const question = await dbService.getQuestion();
        res.json(question);

    // < 100: async creates 5 and delete
    } else if (questionCount < 100) {
        generateQuestionsService.generateQuestions(10);
        const question = await dbService.getQuestion();
        res.json(question);
        dbService.deleteQuestionById(question._id);

    // >= 100: do not create and delete
    } else {
        const question = await dbService.getQuestion();
        res.json(question);
        dbService.deleteQuestionById(question._id);
    }
});

//Get random questions from db: http://localhost:8010/questions/getQuestionsFromDb/3
router.get('/getQuestionsFromDb/:n', async(_req, res) => {
    const n = parseInt(_req.params.n, 10);

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }

    if (await dbService.getQuestionCount() < n) {
        //Must generate n questions
        await generateQuestionsService.generateQuestions(n + 1);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(n * 5);
    }

    questions = await dbService.getRandomQuestions(n);
    if(questions != null)
        questions.map(question => {
            dbService.deleteQuestionById(question._id);
        })
    res.json(questions);
});

//Get random questions from db with category filter: http://localhost:8010/questions/getQuestionsFromDb/2/Geografía
router.get('/getQuestionsFromDb/:n/:category/:lang', async(_req, res) => {
    const n = parseInt(_req.params.n, 10);
    const category = _req.params.category;
    const language = _req.params.lang;

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }
    
    if (await dbService.getQuestionCountByCategory(category, language) < n) {
        //Must generate n questions
        await generateQuestionsService.generateQuestions(n, language, category);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(n, language, category);
    }
    questions = await dbService.getRandomQuestionsByCategory(n, category, language);
    if(questions != null) {
        for(var i = 0; i < questions.length; i++) {
            dbService.deleteQuestionById(questions[i]._id);
        }
    }
    res.json(questions);
    
});

module.exports = router;