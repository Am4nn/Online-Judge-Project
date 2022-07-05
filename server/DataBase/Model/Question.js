const mongoose = require('mongoose');

// id, difficulty, Name, Description, exampleCases, numberOfSubmissions, numberOfSuccess, questionCode
const QuesSchema = new mongoose.Schema({
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    examples: [{
        type: Object,
        input: {
            type: String,
            required: true
        },
        output: {
            type: String,
            required: true
        },
        explaination: {
            type: String
        }
    }],
    noOfSubm: {
        type: Number,
        required: true,
        default: 0
    },
    noOfSuccess: {
        type: Number,
        required: true,
        default: 0,
    },
    code: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('Question', QuesSchema);