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
    }
})

module.exports = mongoose.model('Log', LogSchema);
