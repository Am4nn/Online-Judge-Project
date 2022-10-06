const Question = require('./Model/Question');
const Query = require('./Model/Query');

const getQuestionList = async () => {
    const questions = await Question.find({});
    return questions;
}

const getQuestionById = async id => {
    const question = await Question.findById(`${id}`);
    return question;
}

const createNewQuery = async ({ language, filepath, testcase, quesId, quesName, username }) => {
    const query = new Query({ language, filepath, testcase, quesId, quesName, username });
    await query.save();
    return query;
}

const getQueryById = async queryId => {
    const query = await Query.findById(`${queryId}`);
    return query;
}

const getAllQueriesReverseSorted = async () => {
    const leaders = await Query.find({}).sort({ _id: -1 });
    return leaders;
}

const isAdmin = username => {
    return (username === 'aman');
}

const isGuest = username => {
    return (!username || (username === 'guest'));
}

module.exports = {
    isGuest,
    isAdmin,
    getQueryById,
    createNewQuery,
    getQuestionList,
    getQuestionById,
    getAllQueriesReverseSorted
};