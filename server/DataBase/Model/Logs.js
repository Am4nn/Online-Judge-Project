const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["log", "error"],
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Log', LogSchema);
