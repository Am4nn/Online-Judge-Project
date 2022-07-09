const { getQuestionList, getQuestionById } = require('../DataBase/database');
const ObjectId = require('mongoose').Types.ObjectId;

// Validator function
function isValidObjectId(id) {
    return (ObjectId.isValid(id) && ((String)(new ObjectId(id)) === id))
}

const problemsController = async (req, res) => {
    try {
        console.log('requested all problems');
        const questions = await getQuestionList();
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const detailedProblemController = async (req, res) => {
    try {
        console.log('requested detailed problem');
        const id = req.params.id;
        if (!isValidObjectId(id))
            return res.status(404).json('not a valid object id');

        const question = await getQuestionById(id);
        if (!question)
            return res.status(404).json('id does not exists');
        return res.status(200).json(question);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const verdictController = async (req, res) => {
    try {
        const code = req.body.code;

        console.log(code);

        setTimeout(() => {
            return res.status(200).json('verdictController');
        }, 2000)
    } catch (error) {
        return res.status(400).json(error);
    }
}

const leaderboardController = async (req, res) => {
    try {
        return res.status(200).json('leaderboardController');
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    problemsController,
    detailedProblemController,
    verdictController,
    leaderboardController
};