const assert = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Question = require('../../services/question-data-model');

let mongoServer;
let questionFunctions; 

describe('Question Functions', function() {
    beforeAll(async function() {
      //await mongoose.disconnect();
      mongoServer = await MongoMemoryServer.create();
      const mongoURI = mongoServer.getUri();
      process.env.DATABASE_URI = mongoURI;
      await mongoose.connect(mongoURI);
      questionFunctions = require('../../services/question-data-service');
    });
  
    afterEach(async function() {
      // Limpiar la colección de preguntas después de cada prueba
      await Question.deleteMany({});
    });
  
    afterAll(async function() {
      // Desconectar de la base de datos de prueba después de todas las pruebas
      await mongoServer.stop();
    });
  
    describe('addQuestion', function() {
      it('It should add a question to the database', async function() {
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
});