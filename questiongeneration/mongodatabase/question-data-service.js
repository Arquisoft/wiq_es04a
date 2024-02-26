const mongoose = require('mongoose');
const Question = require('./question-data-model');

//TODO: QUESTION_DATABASE_URI has no value yet
const uri = process.env.QUESTION_DATABASE_URI || 'mongodb://localhost:27017/questionDB';
mongoose.connect(uri);
const port = 8005; 

// Start the server
const server = app.listen(port, () => {
    console.log(`Question-data-service listening at http://localhost:${port}`);
});

// Add question to database
async function addQuestion(questionData) {
    try {
      const newQuestion = new Question(questionData);
      
      const savedQuestion = await newQuestion.save();
      
      console.log('Added question: ', savedQuestion);
    } catch (error) {
      console.error('Error adding the question: ', error.message);
    } 
  }

  // Función para agregar una pregunta a la base de datos
async function addQuestion(questionData) {
  try {
    // Crear una nueva instancia del modelo Question con los datos proporcionados
    const newQuestion = new Question(questionData);
    
    // Guardar la pregunta en la base de datos
    const savedQuestion = await newQuestion.save();
    
    console.log('Pregunta añadida con éxito:', savedQuestion);
  } catch (error) {
    console.error('Error al añadir la pregunta:', error.message);
  } finally {
    // Cerrar la conexión después de realizar la operación
    mongoose.connection.close();
  }
}

// Get random questions
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
  
      console.log('Random questions: ', randomQuestions);
    } catch (error) {
      console.error('Error obtaining random questions: ', error.message);
    } 
  }
  
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});
  
  module.exports = server