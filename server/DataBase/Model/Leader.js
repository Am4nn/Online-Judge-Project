const mongoose = require('mongoose');

const LeaderSchema = new mongoose.Schema({
    quesName: {
        type: String,
        required: true
    },
    quesId: {
        type: String,
        required: true
    },
    codeFile: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    response: {
        type: String
    },
    submittedAt: {
        type: String
    }
});

module.exports = mongoose.model('Leader', LeaderSchema);