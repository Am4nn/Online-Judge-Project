const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['cpp', 'py']
    },
    quesId: {
        type: String,
        required: true
    },
    codeId: {
        type: String
    },
    quesName: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    testcase: {
        type: String,
        required: true
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
    }
});

module.exports = mongoose.model('Query', QuerySchema);