const mongoose = require('mongoose');

const uri = process.env.QUESTION_DATABASE_URI || 'mongodb://localhost:27017/questionDB';
mongoose.connect(uri);

// Start the server
const server = app.listen(port, () => {
    console.log(`Auth Service listening at http://localhost:${port}`);
});
  
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});
  
  module.exports = server