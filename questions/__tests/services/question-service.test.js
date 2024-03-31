const assert = require('assert');
const mongoose = require('mongoose');
const Question = require('../../services/question-data-model');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let questionFunctions;
let mongoURI;

describe('Question Functions', function() {
  beforeAll(async function() {
    //Init a mongo memory server for the tests
    mongoServer = await MongoMemoryServer.create();
    mongoURI = mongoServer.getUri();
    process.env.DATABASE_URI = mongoURI;
    await mongoose.connect(mongoURI);
    questionFunctions = require('../../services/question-data-service');
  });

  afterEach(async function() {
    // Clean database after each test
    await Question.deleteMany({});
  });

  afterAll(async function() {
    // Disconnect at end
    await mongoose.disconnect();
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

    it('It should get an error message', async function() {
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.addQuestion({});
      assert.strictEqual(errorMsg, "Client must be connected before running operations");
      await mongoose.connect(mongoURI);
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

  describe('getRandomQuestions', function() {
    it('It should return two random questions (out of three in database)', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };

        const questionData2 = {
          question: "Which is the capital of France?",
          options: ["Madrid", "Barcelona", "Paris", "London"],
          correctAnswer: "Madrid",
          categories: ["Geography"],
          language: "en"
        };

        const questionData3 = {
          question: "Which is the capital of UK?",
          options: ["Madrid", "Barcelona", "Paris", "London"],
          correctAnswer: "Madrid",
          categories: ["Geography"],
          language: "en"
        };

      await questionFunctions.addQuestion(questionData);
      await questionFunctions.addQuestion(questionData2);
      await questionFunctions.addQuestion(questionData3);

      const randomQuestions = await questionFunctions.getRandomQuestions(2);
        
      assert.strictEqual(randomQuestions.length, 2);
    });
  });

  describe('getRandomQuestionsByCategory', function() {
    it('It should return two random questions filtered by category', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };

        const questionData2 = {
          question: "Which is the capital of France?",
          options: ["Madrid", "Barcelona", "Paris", "London"],
          correctAnswer: "Madrid",
          categories: ["Geography"],
          language: "en"
        };

        const questionData3 = {
          question: "Which is the capital of UK?",
          options: ["Madrid", "Barcelona", "Paris", "London"],
          correctAnswer: "Madrid",
          categories: ["Geography"],
          language: "en"
        };

        const questionData4 = {
          question: "Which is the currency of Spain?",
          options: ["Peseta", "Euro", "Duro", "Dollar"],
          correctAnswer: "Euro",
          categories: ["Political"],
          language: "en"
        };

      await questionFunctions.addQuestion(questionData);
      await questionFunctions.addQuestion(questionData2);
      await questionFunctions.addQuestion(questionData3);
      await questionFunctions.addQuestion(questionData4);

      const randomQuestions = await questionFunctions.getRandomQuestionsByCategory(2, "Geography");
        
      assert.strictEqual(randomQuestions.length, 2);

      randomQuestions.forEach(question => {
        assert.strictEqual(question.categories[0], "Geography");
      });

      const randomQuestionPolitical = await questionFunctions.getRandomQuestionsByCategory(1, "Political");
        
      assert.strictEqual(randomQuestionPolitical.length, 1);

      randomQuestionPolitical.forEach(question => {
        assert.strictEqual(question.categories[0], "Political");
      });

    });
  });

});