const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: Date,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question