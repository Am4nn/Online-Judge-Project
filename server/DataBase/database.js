const Model = require('./Model/Question');

const getQuestionList = async () => {
    const questions = await Model.find({});
    return questions;
}

const getQuestionById = async id => {
    const question = await Model.findById(`${id}`);
    return question;
}

module.exports = { getQuestionList, getQuestionById };