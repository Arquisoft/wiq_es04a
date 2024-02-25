const mongoose = require('mongoose');

//TODO: QUESTION_DATABASE_URI without value
const uri = process.env.QUESTION_DATABASE_URI || 'mongodb://localhost:27017/questionDB';
mongoose.connect(uri);
const port = 8005; 

// Start the server
const server = app.listen(port, () => {
    console.log(`Question-data-service listening at http://localhost:${port}`);
});
  
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});
  
  module.exports = server