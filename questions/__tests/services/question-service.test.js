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

    it('It should get an error message', async function() {
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.getQuestion();
      assert.strictEqual(errorMsg, "Client must be connected before running operations");
      await mongoose.connect(mongoURI);
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
        
        assert.strictEqual(await questionFunctions.getQuestionCount("en"), 1);
    });

    it('It should get an error message', async function() {
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.getQuestionCount("en");
      assert.strictEqual(errorMsg, "Client must be connected before running operations");
      await mongoose.connect(mongoURI);
    });
  });

  describe('getQuestionCountByCategory', function() {
    it('It should count number of questions at the database filtered by category', async function() {
        const questionData = {
            question: "Which is the capital of Spain?",
            options: ["Madrid", "Barcelona", "Paris", "London"],
            correctAnswer: "Madrid",
            categories: ["Geography"],
            language: "en"
        };
        const newQuestion = new Question(questionData);
        await newQuestion.save();
        
        assert.strictEqual(await questionFunctions.getQuestionCountByCategory("Geography","en"), 1);
        assert.strictEqual(await questionFunctions.getQuestionCountByCategory("Political","en"), 0);
    });

    it('It should get an error message', async function() {
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.getQuestionCountByCategory();
      assert.strictEqual(errorMsg, "Client must be connected before running operations");
      await mongoose.connect(mongoURI);
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
        
        assert.strictEqual(await questionFunctions.getQuestionCount("en"), 1);
        await questionFunctions.deleteQuestionById(savedQuestionId);
        assert.strictEqual(await questionFunctions.getQuestionCount("en"), 0);
    });

    it('It should get an error message because of deleting with invalid id', async function() {
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.deleteQuestionById("");
      assert.strictEqual(errorMsg, 'Cast to ObjectId failed for value \"\" (type string) at path \"_id\" for model \"Question\"');
      await mongoose.connect(mongoURI);
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

      const randomQuestions = await questionFunctions.getRandomQuestions(2,"en");
        
      assert.strictEqual(randomQuestions.length, 2);
    });

    it('It should get two error messages', async function() {
      const errorMsgSize = await questionFunctions.getRandomQuestions(40000);
      assert.strictEqual(errorMsgSize, 'Required 40000 questions and there are 0');
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.getRandomQuestions(1);
      assert.strictEqual(errorMsg, "Client must be connected before running operations");
      await mongoose.connect(mongoURI);
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

      const randomQuestions = await questionFunctions.getRandomQuestionsByCategory(2, "Geography","en");
        
      assert.strictEqual(randomQuestions.length, 2);

      randomQuestions.forEach(question => {
        assert.strictEqual(question.categories[0], "Geography");
      });

      const randomQuestionPolitical = await questionFunctions.getRandomQuestionsByCategory(1, "Political","en");
        
      assert.strictEqual(randomQuestionPolitical.length, 1);

      randomQuestionPolitical.forEach(question => {
        assert.strictEqual(question.categories[0], "Political");
      });

    });

    it('It should get two error messages', async function() {
      const errorMsgSize = await questionFunctions.getRandomQuestionsByCategory(40000, "Geography");
      assert.strictEqual(errorMsgSize, null);
      await mongoose.disconnect();
      const errorMsg = await questionFunctions.getRandomQuestionsByCategory(1,"Geography","en");
      assert.strictEqual(errorMsg, "Client must be connected before running operations");
      await mongoose.connect(mongoURI);
    });
  });

});