const assert = require('assert');
const mongoose = require('mongoose');
const Question = require('../services/question-data-model');
const questionFunctions = require('../services/question-data-service');

describe('Question Functions', function() {
  beforeAll(async function() {
    await mongoose.disconnect();
    // Conectar a la base de datos de prueba
    const uri = 'mongodb://localhost:27017/test';
    await mongoose.connect(uri);
    // Limpiar la colección de preguntas antes de cada prueba
    await Question.deleteMany({});
  });

  afterEach(async function() {
    // Limpiar la colección de preguntas después de cada prueba
    await Question.deleteMany({});
  });

  afterAll(async function() {
    // Desconectar de la base de datos de prueba después de todas las pruebas
    await mongoose.disconnect();
  });

  describe('addQuestion', function() {
    it('It should add a question to de database', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };
        await questionFunctions.addQuestion(questionData);
        const questionInDB = await Question.findOne({ question: "Which is the capital of Spain?" });
        assert.strictEqual(questionInDB.question, "Which is the capital of Spain?");
    });
  });

  describe('getQuestion', function() {
    it('It should get a question from the database', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };
        const newQuestion = new Question(questionData);
        await newQuestion.save();
        const questionInDB = await questionFunctions.getQuestion({ question: "Which is the capital of Spain?"});
        assert.strictEqual(questionInDB.question, "Which is the capital of Spain?");
    });
  });

  describe('getQuestionCount', function() {
    it('It should count number of questions at the database', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };
        const newQuestion = new Question(questionData);
        await newQuestion.save();
        
        assert.strictEqual(await questionFunctions.getQuestionCount(), 1);
    });
  });

  describe('deleteQuestionById', function() {
    it('It should delete an added question from the database', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };
        const newQuestion = new Question(questionData);
        const savedQuestion = await newQuestion.save();
        const savedQuestionId = savedQuestion._id;
        
        assert.strictEqual(await questionFunctions.getQuestionCount(), 1);
        await questionFunctions.deleteQuestionById(savedQuestionId);
        assert.strictEqual(await questionFunctions.getQuestionCount(), 0);
    });
  });

});