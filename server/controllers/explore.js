const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');

const {
    Query, Question, User, Code
} = require('../DataBase/database');

const queryQueueDir = `../CodeExecuter/queryQueue${(process.env.NO_REDIS) ? '_noredis' : ''}`;
const { addQueryToQueue } = require(queryQueueDir);

const { createFile } = require('../utils/file');
const { dateTimeNowFormated, logger } = require('../utils/logging');

// ObjectID Validator function
function isValidObjectId(id) {
    return (ObjectId.isValid(id) && ((String)(new ObjectId(id)) === id))
}

const problemsController = async (req, res) => {
    try {
        const questions = await Question.getQuestionList();
        return res.status(200).json(questions);
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json(error);
    }
}

const detailedProblemController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!isValidObjectId(id))
            return res.status(404).json('not a valid object id');

        const question = await Question.getQuestionById(id);
        if (!question)
            return res.status(404).json('id does not exists');
        return res.status(200).json(question);
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json(error);
    }
}

const validLanguages = ['c', 'cpp', 'py', 'js', 'java'];

const verdictController = async (req, res) => {
    try {
        const { language, code, testcase, quesName } = req.body;
        const quesId = req.params.id;

        if (!validLanguages.includes(language))
            return res.status(400).json({ msg: 'Please select a language / valid language !' });

        // user specific details update
        let username = 'guest';
        const token = req.cookies.token;
        if (token) {
            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.incrTotalSubmInUser(verified.user);
                username = user.username;
            } catch {
                username = 'guest';
            }
        }

        const { filename } = createFile(language, code);
        const codeDoc = await Code.createNewCode({ language, code, username });
        const query = await Query.createNewQuery({ language, filepath: filename, testcase, quesId, quesName, username, codeId: codeDoc._id });

        await addQueryToQueue(query, true); // this will async now

        await Question.incrNoOfSubm(quesId);

        res.status(201).json({ status: 'pending', msg: "Request queued, wait for response !", queryId: query._id });
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json({ status: 'error', msg: 'some error occured submitting the code !', error: JSON.stringify(error) });
    }
}

const statusController = async (req, res) => {
    const queryId = req.params.queryId;
    if (!isValidObjectId(queryId))
        return res.status(404).json({ msg: 'not a valid object id' });
    let query = null;
    try {
        query = await Query.getQueryById(queryId);
        if (!query) {
            return res.status(404).json({ msg: 'invalid queryId or this query has been deleted !' });
        }
        res.status(200).json(query);
        if (query.type === 'exec' && (query.status === 'success' || query.status === 'error'))
            await Query.deleteQueryById(queryId);
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        res.status(400).json({ msg: 'on error', error: JSON.stringify(error) });
    }
}

const leaderboardController = async (req, res) => {
    try {
        const leaders = await Query.getAllQueriesReverseSorted();
        return res.status(200).json(leaders);
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json(error);
    }
}

const codesController = async (req, res) => {
    try {
        const codeId = req.params.codeId;
        const code = await Code.getCodeById(codeId);
        if (!code) return res.status(404).json({ error: 'filename does not exists / yet exists or is deleted !' });
        res.status(200).json({ code: code.code, language: code.language });
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        res.status(400).json({ error: JSON.stringify(error) });
    }
}

const invalidLanguage = `Please select a language / valid language.
Or may be this language is not yet supported !`

const codeExecutor = async (req, res) => {
    try {
        const { language, code, input } = req.body;

        if (!validLanguages.includes(language))
            return res.status(400).json({ msg: invalidLanguage });

        const { filepath } = createFile(language, code);
        const query = await Query.createNewQuery({ type: 'exec', filepath, language, input });

        addQueryToQueue(query, false);

        res.status(201).json({ status: 'pending', msg: "Request queued, wait for response !", queryId: query._id });
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json({ status: 'error', msg: 'some error occured submitting the code !', error: JSON.stringify(error) });
    }
}

module.exports = {
    codesController,
    statusController,
    verdictController,
    problemsController,
    leaderboardController,
    detailedProblemController,
    codeExecutor
};