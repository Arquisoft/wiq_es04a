const express = require('express');
const dbService = require('../services/question-data-service');
const generateQuestionsService = require('../services/generate-questions-service');
const router = express.Router();


//Get random question from db and deleting it, adding questions if there are less than 10: http://localhost:8010/questions
router.get('/:lang', async (req, res) => {
    const language = req.params.lang;
    const questionCount = await dbService.getQuestionCount(language);

    // 0: Await till it creates 2, creates 50 async and do not delete
    if (questionCount == 0) {
        await generateQuestionsService.generateQuestions(2, language);
        generateQuestionsService.generateQuestions(50, language);
        const question = await dbService.getQuestion({language: language});
        res.json(question);
        
    // < 50: async creates 10 and do not delete
    } else if (questionCount < 50) {
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(10, language);
        const question = await dbService.getQuestion({language: language});
        res.json(question);

    // < 100: async creates 5 and delete
    } else if (questionCount < 100) {
        generateQuestionsService.generateQuestions(10, language);
        const question = await dbService.getQuestion({language: language});
        res.json(question);
        dbService.deleteQuestionById(question._id);

    // >= 100: do not create and delete
    } else {
        const question = await dbService.getQuestion({language: language});
        res.json(question);
        dbService.deleteQuestionById(question._id);
    }
});

//Get random questions from db: http://localhost:8010/questions/getQuestionsFromDb/3
router.get('/getQuestionsFromDb/:n/:lang', async(_req, res) => {
    const n = parseInt(_req.params.n, 10);
    const language = _req.params.lang;

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }

    if (await dbService.getQuestionCount(language) < n) {
        //Must generate n questions
        await generateQuestionsService.generateQuestions(n + 1, language);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(n * 5, language);
    }

    questions = await dbService.getRandomQuestions(n, language);
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
    const questionCount = await dbService.getQuestionCountByCategory(category, language);

    //Verify is n is a correct number
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Parameter "n" must be > 0.' });
    }
    
    /*if (await dbService.getQuestionCountByCategory(category, language) < n) {
        //Must generate n questions (n because some can fail at generation at the moment 18/04)
        await generateQuestionsService.generateQuestions(n + 2, language, category);
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(n, language, category);
    }
    questions = await dbService.getRandomQuestionsByCategory(n, category, language);
    if(questions != null) {
        for(var i = 0; i < questions.length; i++) {
            dbService.deleteQuestionById(questions[i]._id);
        }
    }
    res.json(questions);*/
    

    // 0: Await till it creates 2, creates 50 async and do not delete
    if (questionCount == 0) {
        await generateQuestionsService.generateQuestions(2, language, category);
        generateQuestionsService.generateQuestions(50, language, category);
        questions = await dbService.getRandomQuestionsByCategory(n, category, language);
        res.json(questions);
        
    // < 50: async creates 10 and do not delete
    } else if (questionCount < 50) {
        //Do not wait to generate the others
        generateQuestionsService.generateQuestions(10, language, category);
        questions = await dbService.getRandomQuestionsByCategory(n, category, language);
        res.json(questions);

    // < 100: async creates 5 and delete
    } else if (questionCount < 100) {
        generateQuestionsService.generateQuestions(10, language, category);
        questions = await dbService.getRandomQuestionsByCategory(n, category, language);
        res.json(questions);
        if(questions != null) {
            for(var i = 0; i < questions.length; i++) {
                dbService.deleteQuestionById(questions[i]._id);
            }
        }

    // >= 100: do not create and delete
    } else {
        questions = await dbService.getRandomQuestionsByCategory(n, category, language);
        res.json(questions);
        if(questions != null) {
            for(var i = 0; i < questions.length; i++) {
                dbService.deleteQuestionById(questions[i]._id);
            }
        }
    }
});

module.exports = router;