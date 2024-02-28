const mongoose = require('mongoose');
const Question = require('./question-data-model');

//TODO: QUESTION_DATABASE_URI has no value yet
const uri = process.env.QUESTION_DATABASE_URI || 'mongodb://localhost:27017/questionDB';
mongoose.connect(uri);

//TODO: when should db call disconnect?

// Add question to database
async function addQuestion(questionData) {
    try {
      const newQuestion = new Question(questionData);
      
      //const savedQuestion = await newQuestion.save();
      await newQuestion.save();
      
      //console.log('Added question: ', savedQuestion);
    } catch (error) {
      console.error('Error adding the question: ', error.message);
    } 
  }


// Get random questions  TODO: refactor to use common code with get questions by category
async function getRandomQuestions(n) {
    try {
      // Obtain total number of questions in database
      const totalQuestions = await Question.countDocuments();
  
      // Check if there are required number of questions
      if (totalQuestions < n) {
        console.log('Required ', n, ' questions and there are ', totalQuestions);
        return;
      }
  
      // Obtain n random indexes
      const randomIndexes = [];
      while (randomIndexes.length < n) {
        const randomIndex = Math.floor(Math.random() * totalQuestions);
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }
  
      // Obtain n random questions
      const randomQuestions = await Question.find().limit(n).skip(randomIndexes[0]);
      return randomQuestions;
      //console.log('Random questions: ', randomQuestions);
    } catch (error) {
      console.error('Error obtaining random questions: ', error.message);
    } 
  }

// Obtaing random questions filtered by category
async function getRandomQuestionsByCategory(n, category) {
    try {
      // Obtain total number of questions with that category
      const totalQuestions = await Question.countDocuments({ category });
  
      // Check if there are required number of questions
      if (totalQuestions < n) {
        console.log('Required ', n, ' questions and there are ', totalQuestions);
        return;
      }
  
     // Obtain n random indexes
     const randomIndexes = [];
     while (randomIndexes.length < n) {
       const randomIndex = Math.floor(Math.random() * totalQuestions);
       if (!randomIndexes.includes(randomIndex)) {
         randomIndexes.push(randomIndex);
       }
     }
  
      // Obtain n random questions with that category
      const randomQuestions = await Question.find({ category }).limit(n).skip(randomIndexes[0]);
      
      return randomQuestions;
      //console.log('Random questions: ', randomQuestions);
    } catch (error) {
      console.error('Error obtaining random questions (with category): ', error.message);
    } 
  }

// Test data
const testQuestions = [
    {
      question: '¿Cuál es la capital de Francia?',
      options: ['Berlín', 'París', 'Londres', 'Madrid'],
      correctAnswer: 'París',
      category: 'Geografía'
    },
    {
      question: '¿En qué año comenzó la Segunda Guerra Mundial?',
      options: ['1935', '1938', '1939', '1942'],
      correctAnswer: '1939',
      category: 'Historia'
    },
    {
      question: '¿Cuál es el elemento más abundante en la corteza terrestre?',
      options: ['Hierro', 'Oxígeno', 'Aluminio', 'Silicio'],
      correctAnswer: 'Oxígeno',
      category: 'Ciencia'
    },
  ];
  
  // Add test data to db
  async function addTestData() {
    try {
      await Question.insertMany(testQuestions);
    } catch (error) {
      console.error('Error in sample data:', error);
    }
  }
  
  module.exports = {
    addQuestion,
    getRandomQuestions,
    getRandomQuestionsByCategory,
    addTestData
};