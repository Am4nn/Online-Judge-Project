const { getQuestionList, getQuestionById } = require('../DataBase/database');
const ObjectId = require('mongoose').Types.ObjectId;

const Query = require('../DataBase/Model/Query');
const { addQueryToQueue } = require('../CodeExecuter/queryQueue');

const {
    readFile,
    createFile,
    deleteFile
} = require('../CodeExecuter/codeExecutor_dockerv');
const Question = require('../DataBase/Model/Question');

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
        const { language, code, testcase, quesName } = req.body;
        const quesId = req.params.id;

        if (language !== 'py' && language !== 'cpp')
            return res.status(400).json({ msg: 'Please select a language / valid language !' });

        const filepath = createFile(language, code);
        const query = new Query({ language, filepath, testcase, quesId, quesName });
        await query.save();

        const queryId = query['_id'];
        addQueryToQueue(queryId);

        const question = await Question.findById(quesId);
        question.noOfSubm += 1;
        await question.save();

        res.status(201).json({ status: 'pending', msg: "Request queued, wait for response !", queryId });
    } catch (err) {
        return res.status(400).json({ status: 'error', msg: 'some error occured submitting the code !', error: JSON.stringify(err) });
    }
}

const statusController = async (req, res) => {
    const queryId = req.params.queryId;
    if (!isValidObjectId(queryId))
        return res.status(404).json({ msg: 'not a valid object id' });
    let query = null;
    try {
        query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({ msg: 'invalid queryId or this query has been deleted !' });
        }
        res.status(200).json(query);
    } catch (err) {
        res.status(400).json({ msg: 'on error', error: JSON.stringify(err) });
    }
}

const leaderboardController = async (req, res) => {
    console.log('leaderboard requested !');
    try {
        const leaders = await Query.find({}).sort({ _id: -1 });
        return res.status(200).json(leaders);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const codesController = async (req, res) => {
    console.log('requested getcode !');
    try {
        const { filepath } = req.body;
        const code = readFile(filepath);
        if (!code) return res.status(404).json({ error: 'filename does not exists or is deleted !' });
        console.log(code, code.toString());
        res.status(200).json({code : code.toString()});
    } catch (error) {
        res.status(400).json({ error: JSON.stringify(error) });
    }
}

module.exports = {
    codesController,
    statusController,
    verdictController,
    problemsController,
    leaderboardController,
    detailedProblemController
};