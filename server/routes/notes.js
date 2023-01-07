const express = require('express');
const router = express.Router();

const {
    getAllNotes,
    addNote,
    getNote,
    editNote,
    deleteNote,
} = require('../controllers/notes');
const { authProvider } = require('../middlewares');
const { loggingMiddleware } = require('../middlewares');

// api/notes/
router.get('/allNotes', loggingMiddleware, authProvider, getAllNotes);
router.get('/:codeid', loggingMiddleware, authProvider, getNote);
router.post('/', loggingMiddleware, authProvider, addNote);
router.put('/:noteid', loggingMiddleware, authProvider, editNote);
router.delete('/:noteid', loggingMiddleware, authProvider, deleteNote);

module.exports = router;