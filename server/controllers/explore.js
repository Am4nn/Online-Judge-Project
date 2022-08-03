const ObjectId = require('mongoose').Types.ObjectId;
const {
    getQueryById,
    createNewQuery,
    getQuestionList,
    getQuestionById,
    getAllQueriesReverseSorted
} = require('../DataBase/database');

// const Query = require('../DataBase/Model/Query');
// const Question = require('../DataBase/Model/Question');
const { addQueryToQueue } = require('../CodeExecuter/queryQueue');

const {
    readFile,
    createFile
} = require('../CodeExecuter/codeExecutor_dockerv');

// Validator function
function isValidObjectId(id) {
    return (ObjectId.isValid(id) && ((String)(new ObjectId(id)) === id))
}

const problemsController = async (req, res) => {
    console.log('GET /api/explore/problems getAllQuestions');
    try {
        const questions = await getQuestionList();
        return res.status(200).json(questions);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const detailedProblemController = async (req, res) => {
    console.log('GET /api/explore/problems/:id getDetailedQuestion');
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
    console.log('POST /api/explore/problems/:id sentCodeForVerdict');
    try {
        const { language, code, testcase, quesName } = req.body;
        const quesId = req.params.id;

        if (language !== 'py' && language !== 'cpp')
            return res.status(400).json({ msg: 'Please select a language / valid language !' });

        const filepath = createFile(language, code);
        // const query = new Query({ language, filepath, testcase, quesId, quesName });
        // await query.save();
        const query = await createNewQuery({ language, filepath, testcase, quesId, quesName });

        const queryId = query['_id'];
        addQueryToQueue(queryId);

        // const question = await Question.findById(quesId);
        const question = await getQuestionById(quesId);
        question.noOfSubm += 1;
        await question.save();

        res.status(201).json({ status: 'pending', msg: "Request queued, wait for response !", queryId });
    } catch (err) {
        return res.status(400).json({ status: 'error', msg: 'some error occured submitting the code !', error: JSON.stringify(err) });
    }
}

const statusController = async (req, res) => {
    console.log('GET /api/explore/status/:queryId getStatusOfQuery');
    const queryId = req.params.queryId;
    if (!isValidObjectId(queryId))
        return res.status(404).json({ msg: 'not a valid object id' });
    let query = null;
    try {
        // query = await Query.findById(queryId);
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
    console.log('GET /api/explore/leaderboard getLeaderboard');
    try {
        // const leaders = await Query.find({}).sort({ _id: -1 });
        const leaders = await getAllQueriesReverseSorted();
        return res.status(200).json(leaders);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const codesController = async (req, res) => {
    console.log('POST /api/explore/getcode getCodeOfAQuery');
    try {
        const { filepath } = req.body;
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