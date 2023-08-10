const {
    Code, Note, Authorization
} = require('../DataBase/database');
const { dateTimeNowFormated, logger } = require('../utils/logging');

const ObjectId = require('mongoose').Types.ObjectId;
// ObjectID Validator function
function isValidObjectId(id) {
    return (ObjectId.isValid(id) && ((String)(new ObjectId(id)) === id))
}

// every req will have user (i.e. userID) and username due to authProvider middleware
// if user is undefined that means user is not logged in and username will be guest

// gets all notes (global and public) but private notes only which belong to user
const getAllNotes = async (req, res) => {
    const isAdminMode = (Authorization.isAdmin(req.username) && (req.query.admin === 'true'));
    try {
        const filter = isAdminMode ? {} : {
            "$or": [
                { access: { "$in": ['global', 'public'] } },
                { access: 'private', username: req.username }
            ]
        };
        const notes = await Note.getNoteByFilter(filter);
        res.status(200).json(notes);
    } catch (err) {
        logger.error(err, dateTimeNowFormated());
        res.status(500).json(err);
    }
}

// gets code and language for a codeid
const getNote = async (req, res) => {
    try {
        const codeid = req.params.codeid;
        const noteid = req.query.noteid;
        if (!isValidObjectId(codeid) || !isValidObjectId(noteid))
            return res.status(404).json('not a valid object id');

        const code = await Code.getCodeById(codeid);
        const note = await Note.getNoteById(noteid);
        logger.log("Note: ", note.title);
        if (!code)
            return res.status(404).json('id does not exists');

        if ((note.access === 'private') && !Authorization.isAdmin(req.username) && (code.user !== req.user)) // guest can't make private notes so no issues here
            return res.status(401).json("Unauthorized: private note can only be accessed by user who owns this note");

        return res.status(200).json(code);
    } catch (err) {
        logger.error(err, dateTimeNowFormated());
        res.status(500).json(err);
    }
}

// add note and code to database
const addNote = async (req, res) => {
    try {
        const user = req.user;
        const username = req.username;
        let { title, desc, code, language, access, editable } = req.body;


        if (!title || !desc || !language || !access) {
            return res.status(400).json("title, description and access are required so please fill all !!!");
        }

        logger.log('Add Note :', title);

        if ((Authorization.isGuest(username)) || (!Authorization.isAdmin(username) && access === 'global')) access = 'public';

        title = title.trim();
        desc = desc.trim();
        code = code.trim();

        const newcode = await Code.createNewCode({ code, language, user });
        const note = await Note.createNewNote({ title, desc, username, access, editable, codeid: newcode._id });

        res.status(200).json(`Server : Note added to database, Note_id = ${note._id}`);
    } catch (err) {
        logger.error(err, dateTimeNowFormated());
        res.status(500).json(err);
    }
}

// edits a note
const editNote = async (req, res) => {
    try {
        const username = req.username;
        const noteid = req.params.noteid;

        if (!isValidObjectId(noteid))
            return res.status(404).json('not a valid object id');

        let { title, desc, code, language, access, editable } = req.body;
        if (!title || !desc || !language || !access) {
            return res.status(400).json("title, description and access are required so please fill all !!!");
        }

        if ((Authorization.isGuest(username)) || (!Authorization.isAdmin(username) && access === 'global'))
            access = 'public';

        const note = await Note.getNoteById(noteid);

        logger.log("Edit Note :", note.title);

        const isEditable = (Authorization.isAdmin(username) || (note.access !== 'private' && note.editable) || (!Authorization.isGuest(username) && (username === note.username)));
        if (!isEditable) return res.status(400).json("Unauthorized: You can't edit this note !");

        const codeDB = await Code.getCodeById(note.codeid);

        note.title = title.trim();
        note.desc = desc.trim();
        note.access = access;
        note.editable = editable;
        note.lastModifiedAt = Date.now();

        codeDB.code = code.trim();
        codeDB.language = language;

        await note.save();
        await codeDB.save();

        res.status(200).json(`Server : Note updated, Note_id = ${note._id} Code_id = ${codeDB._id}`);
    } catch (err) {
        logger.error(err, dateTimeNowFormated());
        res.status(500).json(err);
    }
}

// deletes a note permanently
const deleteNote = async (req, res) => {
    try {
        const username = req.username;
        const noteid = req.params.noteid;

        if (!isValidObjectId(noteid))
            return res.status(404).json('not a valid object id');

        const note = await Note.getNoteById(noteid);
        if (!note)
            return res.status(404).json("This note is already deleted or D.N.E. !");

        const codeid = note.codeid;

        if (!Authorization.isAdmin(username)) {
            if (note.access === 'global')
                return res.status(401).json("Unauthorized: Not an Admin, Global Notes can only be deleted by Admin");

            if (Authorization.isGuest(username))
                return res.status(401).json("Unauthorized: public notes by guest can only be deleted by admin !");

            if (note.username !== username)
                return res.status(401).json("Unauthorized: private note can only be accessed by user who owns this note");
        }

        logger.log("Delete Note :", note.title);

        await Note.deleteNoteById(noteid);
        await Code.deleteCodeById(codeid);

        res.status(200).json(`Server : Note delete successfully from database permanently !, Note_id = ${noteid}`);

    } catch (err) {
        logger.error(err, dateTimeNowFormated());
        res.status(500).json(err);
    }
}

module.exports = {
    getAllNotes,
    addNote,
    getNote,
    editNote,
    deleteNote
};
