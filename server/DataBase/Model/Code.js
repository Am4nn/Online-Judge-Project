const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Code', CodeSchema);