const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
    code: {
        type: String
    },
    language: {
        type: String,
        required: true
    },
    user: { // represents user id
        type: String
    }
});

module.exports = mongoose.model('Code', CodeSchema);