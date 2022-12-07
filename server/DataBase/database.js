const Question = require('./Model/Question');
const Query = require('./Model/Query');
const User = require('./Model/User');
const Code = require('./Model/Code');
const Note = require('./Model/Note');


// Question
const getQuestionList = async () => {
    const questions = await Question.find({});
    return questions;
}
const getQuestionById = async id => {
    const question = await Question.findById(`${id}`);
    return question;
}


// Query
const createNewQuery = async params => {
    const query = new Query(params);
    await query.save();
    return query;
}
const getQueryById = async queryId => {
    const query = await Query.findById(`${queryId}`);
    return query;
}
const getAllQueriesReverseSorted = async () => {
    const leaders = await Query.find({ type: { $ne: 'exec' } }).sort({ _id: -1 });
    return leaders;
}
const deleteQueryById = async queryId => {
    await Query.findByIdAndDelete(queryId);
}


// User
const createNewUser = async ({ name, username, email, passwordHash }) => {
    const newUser = new User({ name, username, email, passwordHash });
    const savedUser = await newUser.save();
    return savedUser;
}
const getUserById = async userId => {
    const user = await User.findById(userId);
    return user;
}
const findOneUser = async filter => {
    const user = await User.findOne(filter);
    return user;
}


// Note
const createNewNote = async params => {
    const note = new Note(params);
    await note.save();
    return note;
}
const getNoteById = async noteId => {
    const note = await Note.findById(noteId);
    return note;
}
const getNoteByFilter = async filter => {
    const notes = await Note.find(filter);
    return notes;
}
const deleteNoteById = async noteId => {
    await Note.deleteOne({ _id: noteId });
}


// Code
const createNewCode = async params => {
    const code = new Code(params);
    await code.save();
    return code;
}
const getCodeById = async codeId => {
    const code = await Code.findById(codeId);
    return code;
}
const deleteCodeById = async codeId => {
    await Code.deleteOne({ _id: codeId });
}


// Authorization
const isAdmin = username => {
    return (username === 'aman');
}
const isGuest = username => {
    return (!username || (username === 'guest'));
}


module.exports = {
    Question: { getQuestionList, getQuestionById },
    Query: { createNewQuery, getQueryById, getAllQueriesReverseSorted, deleteQueryById },
    User: { createNewUser, getUserById, findOneUser },
    Note: { createNewNote, getNoteById, getNoteByFilter, deleteNoteById },
    Code: { createNewCode, getCodeById, deleteCodeById },
    Authorization: { isAdmin, isGuest }
};
