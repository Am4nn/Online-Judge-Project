const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    solvedQuestions: [{
        type: String
    }],
    totalSubmissions: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', UserSchema);