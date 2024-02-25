const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: String,
    question: String,
    options: [String],
    correctAnswer: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question