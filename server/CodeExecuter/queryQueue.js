// Requirements: Bull requires a Redis version greater than or equal to 2.8.18

const Queue = require('bull');
const {
    Authorization, Query,
    Question, User
} = require('../DataBase/database');
const codeExecutorDir = `./codeExecutor${(process.env.NO_DOCKER ? "_nodockerv" : "_dockerv")}`;
const {
    execCode, execCodeAgainstTestcases, languageSpecificDetails
} = require(codeExecutorDir);

const {
    deleteFile, deleteFolderRecursive
} = require('../utils/file');
const { dateTimeNowFormated, logger } = require('../utils/logging');
const path = require('path');

logger.log("Redis version greater than or equal to 2.8.18 Required !");

const WORKERS_NUMBER = 5;
const QUEUE_CONFIG = {
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
    }
};

const queryQueue = new Queue('query-queue', QUEUE_CONFIG);

const processAgainstTestcases = async query => {
    let response = await execCodeAgainstTestcases(query.filepath, query.language, query.testcase);

    await Question.incrNoOfSuccess(query.quesId);

    if (query.username && !Authorization.isGuest(query.username)) {
        await User.addSolvedQuestionToUser(query.username, query.quesId);
    }

    return response;
}

const processAgainstInput = async query => {
    return await execCode(query.filepath, query.language, query.input);
}

queryQueue.process(WORKERS_NUMBER, async ({ data }) => {
    const { query, withTestcase } = data;
    const startTime = new Date();
    try {

        const response = await (withTestcase ? processAgainstTestcases(query) : processAgainstInput(query));

        await Query.getQueryByIdAndUpdate(query._id, {
            startTime,
            completeTime: new Date(),
            status: 'success',
            output: response
        });

    } catch (error) {
        if (!error.msg) {
            logger.error('Error without msg in bull.process', error, dateTimeNowFormated());
            error = { ...error, msg: 'some server side errors' };
        }
        if (query) {
            await Query.getQueryByIdAndUpdate(query._id, {
                startTime,
                completeTime: new Date(),
                status: 'error',
                output: error
            });
        } else {
            logger.log('Error in queryQueue: ', error, dateTimeNowFormated());
        }
    } finally {
        if (query && query.filepath) deleteFile(query.filepath);
        if (query && query.filepath && languageSpecificDetails[query.language].compiledExtension) {
            // if code got compiled then delete the compiled file
            const filepath = query.filepath.split('.')[0];
            if (query.language === 'java') {
                deleteFolderRecursive(path.join(__dirname, "codeFiles", filepath));
            } else {
                deleteFile((filepath + '.' + languageSpecificDetails[query.language].compiledExtension));
            }
        }
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

/**
 * Adds query to queue
 * @param {*} query 
 * @param {Boolean} withTestcase - code should be checked against testcase or not
 */
const addQueryToQueue = async (query, withTestcase = false) => {
    return await queryQueue.add({ query, withTestcase });
}

module.exports = {
    addQueryToQueue
};
