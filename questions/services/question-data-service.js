const mongoose = require('mongoose');
const Question = require('./question-data-model');
require('dotenv').config();

let uri = process.env.DATABASE_URI || 'mongodb://localhost:27017/questionDB';
mongoose.connect(uri);

module.exports = {
  // Add question to database
  addQuestion : async function(questionData) {
    try {
      const newQuestion = new Question(questionData);
      //console.log(newQuestion);
      await newQuestion.save();
      console.log(`Question ${newQuestion._id} saved successfully in DB`);
    } catch (error) {
      console.error('Error adding the question: ', error.message);
      return error.message;
    }
  },


  //TODO - Filter func not yet implemented
  /**
   * Returns a question from the database that could be filtered using a dictionary and removes it.
   * @param {dict} filter - The dict containing the filter options for mongoose.
   * @returns {Question} The question (it will be removed from DB)
   */
  getQuestion : async function(filter = {}) {
    try {
      const question = await Question.findOne(filter);
      return question;

    } catch (error) {
      console.error('Error obtaining the question', error.message);
      return error.message;
    }
  },

  /**
   * Deletes a question from the database.
   * @param {id} str - The id of the document to be removed
   */
  deleteQuestionById : async function(id) {
    try {
      await Question.findByIdAndDelete(id);
      console.log(`Question ${id} deleted successfully`);

    } catch (error) {
        console.error('Error deleting question:', error.message);
        return error.message;
    }
  },

  /**
   * Returns a the number of questions in the db.
   * @returns {int} The question count
   */
  getQuestionCount : async function() {
    try {
      // Obtain total number of questions in database
      const totalQuestions = await Question.countDocuments();
      return totalQuestions;

    } catch (error) {
      console.error('Error obtaining the number of questions: ', error.message);
      return error.message;
    }
  },

  /**
   * Returns a the number of questions in the db.
   * @returns {int} The question count
   */
  getQuestionCountByCategory : async function(wantedCategory) {
    try {
      // Obtain total number of questions in database
      const totalQuestions = await Question.countDocuments({ categories: wantedCategory });
      return totalQuestions;

    } catch (error) {
      console.error('Error obtaining the number of questions for category ', wantedCategory,': ', error.message);
      return error.message;
    }
  },


  // Get random questions  TODO: refactor to use common code with get questions by category
  getRandomQuestions : async function(n) {
    try {
      // Obtain total number of questions in database
      const totalQuestions = await Question.countDocuments();
  
      // Check if there are required number of questions
      if (totalQuestions < n) {
        console.log('Required ', n, ' questions and there are ', totalQuestions);
        return 'Required ' + n + ' questions and there are ' + totalQuestions;
      }

      return Question.aggregate([{ $sample: { size: n } }]);
      
    } catch (error) {
      console.error('Error obtaining random questions: ', error.message);
      return error.message;
    }
  },

  // Obtaing random questions filtered by category
  getRandomQuestionsByCategory : async function(n, wantedCategory) {
    try {
      // Obtain total number of questions with that category
      const totalQuestions = await Question.countDocuments({ categories: wantedCategory });
  
      // Check if there are required number of questions
      if (totalQuestions < n) {
        console.log('Required ', n, ' questions and there are ', totalQuestions);
        return 'Required', n, ' questions and there are ', totalQuestions;
      }
      
    return Question.aggregate([
      { $match: { categories: wantedCategory } }, 
      { $sample: { size: n } }
      ]);
      
    } catch (error) {
      console.error('Error obtaining random questions (with category): ', error.message);
      return error.message;
    }
  },
};
