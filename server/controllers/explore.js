const { getQuestionList, getQuestionById } = require('../DataBase/database');
const ObjectId = require('mongoose').Types.ObjectId;

const { createFile, deleteFile, execCppCode } = require('../CodeExecutor/codeExecuter')

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
        const { language, code, testcase } = req.body;

        const filePath = createFile(language, code);
        const response = await execCppCode(filePath, testcase);
        // deleteFile(filePath);

        return res.status(200).json(response);
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