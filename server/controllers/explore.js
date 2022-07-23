const { getQuestionList, getQuestionById } = require('../DataBase/database');
const ObjectId = require('mongoose').Types.ObjectId;

const Query = require('../DataBase/Model/Query');
const { addQueryToQueue } = require('../CodeExecuter/queryQueue');
const Leader = require('../DataBase/Model/Leader');

const {
    createFile,
    deleteFile,
} = require('../CodeExecuter/codeExecuter');

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

        if (language !== 'py' && language !== 'cpp')
            return res.status(400).json({ msg: 'Please select a language / valid language !' });

        const filepath = createFile(language, code);
        const query = new Query({ language, filepath, testcase });
        await query.save();

        // const leader = new Leader();

        const queryId = query['_id'];
        addQueryToQueue(queryId);

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

    // code to delete files not required anymore or can be saved to display in leaderboard
    // try {
    //     if (query) {
    //         deleteFile(query.filepath);
    //         deleteOutFile(query.filepath, 'out');
    //         await Query.findByIdAndDelete(queryId);
    //         console.log('Deleted without errors !');
    //     }
    // } catch (err) {
    //     console.log('Error in deleting step ! ', err);
    // }
}

const leaderboardController = async (req, res) => {
    try {
        return res.status(200).json('leaderboardController');
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    statusController,
    verdictController,
    problemsController,
    leaderboardController,
    detailedProblemController
};