const Question = require('./Model/Question');
const Query = require('./Model/Query');
const User = require('./Model/User');
const Code = require('./Model/Code');
const Note = require('./Model/Note');
const Logs = require('./Model/Logs');


// Question
const getQuestionList = async () => {
    return await Question.find({});
}
const getQuestionById = async id => {
    return await Question.findById(`${id}`);
}
const incrNoOfSubm = async quesId => {
    return await Question.updateOne({ _id: quesId }, { $inc: { noOfSubm: 1 } });
}
const incrNoOfSuccess = async quesId => {
    return await Question.updateOne({ _id: quesId }, { $inc: { noOfSuccess: 1 } });
}



// Query
const createNewQuery = async params => {
    return await Query.create(params);
}
const getQueryById = async queryId => {
    return await Query.findById(`${queryId}`);
}
const getAllQueriesReverseSorted = async () => {
    return await Query.find({ type: { $ne: 'exec' } }).sort({ _id: -1 });
}
const deleteQueryById = async queryId => {
    return await Query.findByIdAndDelete(queryId);
}
const getQueryByIdAndUpdate = async (queryId, options) => {
    return await Query.findOneAndUpdate(
        { _id: queryId },
        options,
        { new: true }
    );
}


// User
const createNewUser = async ({ name, username, email, passwordHash }) => {
    return await User.create({ name, username, email, passwordHash });
}
const getUserById = async userId => {
    return await User.findById(userId);
}
const findOneUser = async filter => {
    return await User.findOne(filter);
}
const addSolvedQuestionToUser = async (username, quesId) => {
    return await User.findOneAndUpdate(
        { username },
        { $addToSet: { solvedQuestions: quesId } },
        { new: true }
    );
}
const incrTotalSubmInUser = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        { $inc: { totalSubmissions: 1 } },
        { new: true }
    );
}


// Note
const createNewNote = async params => {
    return await Note.create(params);
}
const getNoteById = async noteId => {
    return await Note.findById(noteId);
}
const getNoteByFilter = async filter => {
    return await Note.find(filter);
}
const deleteNoteById = async noteId => {
    return await Note.deleteOne({ _id: noteId });
}


// Code
const createNewCode = async params => {
    return await Code.create(params);
}
const getCodeById = async codeId => {
    return await Code.findById(codeId);
}
const deleteCodeById = async codeId => {
    return await Code.deleteOne({ _id: codeId });
}


// Authorization
const isAdmin = username => {
    return (username === 'aman');
}
const isGuest = username => {
    return (!username || (username === 'guest'));
}


// Logs
const createNewLog = async params => {
    return await Logs.create(params);
}


module.exports = {
    Question: { getQuestionList, getQuestionById, incrNoOfSubm, incrNoOfSuccess },
    Query: { createNewQuery, getQueryById, getAllQueriesReverseSorted, deleteQueryById, getQueryByIdAndUpdate },
    User: { createNewUser, getUserById, findOneUser, addSolvedQuestionToUser, incrTotalSubmInUser },
    Note: { createNewNote, getNoteById, getNoteByFilter, deleteNoteById },
    Code: { createNewCode, getCodeById, deleteCodeById },
    Authorization: { isAdmin, isGuest },
    Logs: { createNewLog }
};
