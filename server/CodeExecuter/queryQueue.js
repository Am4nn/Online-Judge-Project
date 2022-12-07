// Requirements: Bull requires a Redis version greater than or equal to 2.8.18

const Queue = require('bull');
const {
    Authorization, Query,
    Question, User, Code
} = require('../DataBase/database');
const {
    deleteFile, readFile, execCode,
    execCodeAgainstTestcases
} = require('./codeExecutor_dockerv');
const { dateTimeNowFormated, logger } = require('../utils');

const WORKERS_NUMBER = 5;


const queryQueue = new Queue('query-queue');

queryQueue.process(WORKERS_NUMBER, async ({ data }) => {
    const { id: queryId } = data;
    let query = null;
    try {
        query = await Query.getQueryById(queryId);
        if (!query) throw Error("Query not found");

        // create an entry in code database
        const code = await Code.createNewCode({ code: (readFile(query.filepath).toString()), language: query.language });
        query.codeId = code._id;
        query.startTime = new Date();

        let response = await execCodeAgainstTestcases(query.filepath, query.testcase, query.language);

        query.completeTime = new Date();
        query.status = 'success';
        query.output = response;
        await query.save(); // TODO : saving the changes to database

        const question = await Question.getQuestionById(query.quesId);
        question.noOfSuccess += 1;
        await question.save(); // TODO : saving the changes to database

        if (query.username && !Authorization.isGuest(query.username)) {
            const user = await User.findOneUser({ username: query.username });
            if (!user.solvedQuestions) {
                user.solvedQuestions = [];
            }
            if (!user.solvedQuestions.includes(query.quesId)) {
                user.solvedQuestions.push(query.quesId);
            }
            await user.save(); // TODO : saving the changes to database
        }

    } catch (error) {
        if (!error.msg) {
            logger.error('Error without msg in bull.process', error, dateTimeNowFormated());
            error = { ...error, msg: 'some server side errors' };
        }
        if (query) {
            query.completeTime = new Date();
            query.status = 'error';
            query.output = error;
            await query.save(); // TODO : saving the changes to database
        } else logger.log('Error in queryQueue: ', error, dateTimeNowFormated());
    } finally {
        if (query && query.filepath) deleteFile(query.filepath);
    }
    return true;
})

// set status of query to error with some appropriate msg
queryQueue.on('failed', error => {
    logger.error('bull/redis failed', error.data.id, error.failedReason, dateTimeNowFormated());
})

queryQueue.on('error', error => {
    logger.error('bull/redis error', error, dateTimeNowFormated());
})


const addQueryToQueue = async queryId => {
    await queryQueue.add({ id: queryId });
}





// ###############################################################





const queryQueue_exec = new Queue('query-queue-exec');

queryQueue_exec.process(WORKERS_NUMBER, async ({ data }) => {
    const { queryId } = data;
    let query = null;
    try {
        query = await Query.getQueryById(queryId);
        if (!query) throw new Error("Query not found");

        const { filepath, language, input } = query;

        let response = await execCode(filepath, language, input);

        query.status = 'success';
        query.output = response;
        await query.save();

    } catch (error) {
        if (!error.msg) {
            logger.error('Error without msg in bull.process', error, dateTimeNowFormated());
            error = { ...error, msg: 'some server side errors' };
        }
        if (query) {
            query.status = 'error';
            query.output = error;
            await query.save();
        } else logger.log('Error in queryQueue: ', error, dateTimeNowFormated());
    } finally {
        if (query && query.filepath) deleteFile(query.filepath);
    }
    return true;
});

// set status of query to error with some appropriate msg
queryQueue_exec.on('failed', error => {
    logger.error('bull/redis failed', error.data.id, error.failedReason, dateTimeNowFormated());
})

queryQueue_exec.on('error', error => {
    logger.error('bull/redis error', error, dateTimeNowFormated());
})

const addQueryToQueue_Exec = async (queryId) => {
    await queryQueue_exec.add({ queryId });
}



module.exports = {
    addQueryToQueue,
    addQueryToQueue_Exec
};
