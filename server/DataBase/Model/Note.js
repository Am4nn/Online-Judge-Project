const mongoose = require('mongoose');

// Schema : _id, title, desc, codeid, username, access, editable

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    access: {
        type: String,
        required: true,
        enum: ['global', 'public', 'private']
    },
    editable: {
        type: Boolean,
        require: true
    },
    codeid: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NoteSchema);