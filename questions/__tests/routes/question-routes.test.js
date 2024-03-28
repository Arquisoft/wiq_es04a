const Question = require('../../services/question-data-model.js');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const questionRoutes = require('../../routes/question-routes.js');


let mongoServer;
let app = express();
app.use(bodyParser.json());
app.use('/questions', questionRoutes);

const questionData = {
    question: "Which is the capital of Spain?",
    options: ["Madrid", "Barcelona", "Paris", "London"],
    correctAnswer: "Madrid",
    categories: ["Geography"],
    language: "en"
};


async function addQuestion(questionData) {
  const newQuestion = new Question({
    question: questionData.question,
    options: questionData.options,
    correctAnswer: questionData.correctAnswer,
    categories: questionData.categories,
    language: questionData.language
  });
  await newQuestion.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.TEST_DATABASE_URI = mongoUri;
  await mongoose.connect(mongoUri);

  //Load database with initial conditions
  //await addQuestion(questionData);
});

beforeEach(async () => {
  await addQuestion(questionData);
});

  afterAll(async () => {
    //await mongoose.disconnect();
    //app.close();
    await mongoServer.stop();
    // Desconectar de la base de datos de prueba después de todas las pruebas
    //await mongoose.disconnect();
  });

  /*describe('Question routes', function() {
    it('It should add a question to de database', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };
        await questionFunctions.addQuestion(questionData);
        const question = await Question.findOne({ text: "Which is the capital of Spain?" });
        assert.strictEqual(question.text, "Which is the capital of Spain?");
    });
  });*/

  describe('Question routes', function() {
    it('It should get a question from the database', async function() {
        const response = await request(app).get('/questions/');
        expect(response.status).toBe(200);
        console.log(response.body);
    }, 10000);

    /*it('It should get n questions from the database', async function() {
      const response = await request(app).get('/getQuestionsFromDb/1');
      expect(response.status).toBe(200);
    }, 10000);*/
  });



describe('MongoDB Connection', () => {
    it('should connect to the MongoDB server in memory', async () => {
        expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    });
});
