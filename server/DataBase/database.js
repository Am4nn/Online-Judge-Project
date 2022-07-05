const mongoose = require('mongoose');
const Model = require('./Model/Question');

const getQuestionList = async () => {
    const questions = await Model.find({});
    return questions;
}

module.exports = { getQuestionList };