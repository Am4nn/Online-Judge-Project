
const kue = require('kue');
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

logger.log("No Redis Required !");

const WORKERS_NUMBER = 5;

const redisMock = require('redis-mock');

const queue = kue.createQueue({
    prefix: 'queue',
    jobEvents: false,
    disableSearch: true,
    jobQueueSchedulingInterval: 1000,
    redis: {
        createClientFactory: () => redisMock.createClient(),
    },
});

/**
 * Adds query to queue
 * @param {*} query 
 * @param {Boolean} withTestcase - code should be checked against testcase or not
 */
const addQueryToQueue = async (query, withTestcase = false) => {
    const job = queue.create('query-queue', { query, withTestcase })
        .priority('high')
        .attempts(3)
        .backoff(true)
        .removeOnComplete(true)
        // .removeOnFail(true)
        .save(err => {
            if (err) {
                logger.error('Error adding job to queue', err, dateTimeNowFormated());
            } else {
                logger.log('Job added to queue', job.id, dateTimeNowFormated());
            }
        });
    return job;
};

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

queue.process('query-queue', WORKERS_NUMBER, async (job, done) => {
    const { query, withTestcase } = job.data;
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
    done();
});

// set status of query to error with some appropriate msg
queue.on('job failed', (id, err) => {
    logger.error('kue failed', id, err, dateTimeNowFormated());
});

queue.on('error', err => {
    logger.error('kue error', err, dateTimeNowFormated());
});

module.exports = {
    addQueryToQueue
};
