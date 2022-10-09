const ObjectId = require('mongoose').Types.ObjectId;
const {
    getQueryById,
    createNewQuery,
    getQuestionList,
    getQuestionById,
    getAllQueriesReverseSorted
} = require('../DataBase/database');

const jwt = require('jsonwebtoken');

const { addQueryToQueue } = require('../CodeExecuter/queryQueue');

const User = require('../DataBase/Model/User');

const {
    readFile,
    createFile
} = require('../CodeExecuter/codeExecutor_dockerv');
const { dateTimeNowFormated } = require('../utils');

// ObjectID Validator function
function isValidObjectId(id) {
    return (ObjectId.isValid(id) && ((String)(new ObjectId(id)) === id))
}

const problemsController = async (req, res) => {
    console.log('GET /api/explore/problems getAllQuestions', dateTimeNowFormated());
    try {
        const questions = await getQuestionList();
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const detailedProblemController = async (req, res) => {
    console.log('GET /api/explore/problems/:id getDetailedQuestion', dateTimeNowFormated());
    try {
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
    console.log('POST /api/explore/problems/:id sentCodeForVerdict', dateTimeNowFormated());
    try {
        const { language, code, testcase, quesName } = req.body;
        const quesId = req.params.id;

        if (language !== 'py' && language !== 'cpp')
            return res.status(400).json({ msg: 'Please select a language / valid language !' });

        let username = 'guest';
        const token = req.cookies.token;
        try {
            if (token) {
                const verified = jwt.verify(token, process.env.JWT_SECRET);
                const userId = verified.user;
                const user = await User.findById(userId);
                username = user.username;
                user.totalSubmissions += 1;
                await user.save();
            }
        } catch {
            username = 'guest';
        }

        const { filename } = createFile(language, code);
        const query = await createNewQuery({ language, filepath: filename, testcase, quesId, quesName, username });

        const queryId = query['_id'];
        addQueryToQueue(queryId);

        const question = await getQuestionById(quesId);
        question.noOfSubm += 1;
        await question.save();

        res.status(201).json({ status: 'pending', msg: "Request queued, wait for response !", queryId });
    } catch (err) {
        console.error(err, dateTimeNowFormated());
        return res.status(400).json({ status: 'error', msg: 'some error occured submitting the code !', error: JSON.stringify(err) });
    }
}

const statusController = async (req, res) => {
    console.log('GET /api/explore/status/:queryId getStatusOfQuery', dateTimeNowFormated());
    const queryId = req.params.queryId;
    if (!isValidObjectId(queryId))
        return res.status(404).json({ msg: 'not a valid object id' });
    let query = null;
    try {
        query = await getQueryById(queryId);
        if (!query) {
            return res.status(404).json({ msg: 'invalid queryId or this query has been deleted !' });
        }
        res.status(200).json(query);
    } catch (err) {
        res.status(400).json({ msg: 'on error', error: JSON.stringify(err) });
    }
}

const leaderboardController = async (req, res) => {
    console.log('GET /api/explore/leaderboard getLeaderboard', dateTimeNowFormated());
    try {
        const leaders = await getAllQueriesReverseSorted();
        return res.status(200).json(leaders);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const codesController = async (req, res) => {
    console.log('POST /api/explore/getcode getCodeOfAQuery', dateTimeNowFormated());
    try {
        let { filepath } = req.body;
        const code = readFile(filepath);
        if (!code) return res.status(404).json({ error: 'filename does not exists or is deleted !' });
        res.status(200).json({ code: code.toString() });
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