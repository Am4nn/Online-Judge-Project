const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    username: {
        type: String
    },
    language: {
        type: String,
        enum: ['c', 'cpp', 'py', 'java', 'js'],
        required: true
    },
    quesId: {
        type: String
    },
    codeId: {
        type: String
    },
    quesName: {
        type: String
    },
    filepath: {
        type: String,
        required: true
    },
    input: {
        type: String
    },
    testcase: {
        type: String
    },
    submitTime: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: Date
    },
    completeTime: {
        type: Date
    },
    output: {
        type: Object,
        msg: {
            type: String
        },
        stderr: {
            type: String
        },
        stdout: {
            type: String
        },
        error: {
            type: String
        }
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'success', 'error']
    },
    type: {
        type: String
    }
});

module.exports = mongoose.model('Query', QuerySchema);