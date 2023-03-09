
const kue = require('kue');
const {
    Authorization, Query,
    Question, User, Code
} = require('../DataBase/database');

const codeExecutorDir = `./codeExecutor${(process.env.NO_DOCKER ? "_nodockerv" : "_dockerv")}`;
const {
    deleteFile, readFile, execCode,
    execCodeAgainstTestcases
} = require(codeExecutorDir);
const { dateTimeNowFormated, logger } = require('../utils');

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

// ###############################################################
// ###############################################################

const addQueryToQueue = async (queryId) => {
    const job = queue.create('query-queue', { id: queryId })
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

queue.process('query-queue', WORKERS_NUMBER, async (job, done) => {
    const { id: queryId } = job.data;
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
            logger.error('Error without msg in kue process', error, dateTimeNowFormated());
            error = { ...error, msg: 'some server side errors' };
        }
        if (query) {
            query.completeTime = new Date();
            query.status = 'error';
            query.output = error;
            await query.save(); // TODO : saving the changes to database
        } else logger.log('Error in kue process: ', error, dateTimeNowFormated());
    } finally {
        if (query && query.filepath) deleteFile(query.filepath);
    }
    done();
});

// ###############################################################
// ###############################################################


// ###############################################################
// ###############################################################

const addQueryToQueue_Exec = async (queryId) => {
    const job = queue.create('query-queue-exec', { id: queryId })
        .priority('high')
        .attempts(3)
        .backoff(true)
        .removeOnComplete(true)
        .removeOnFail(true)
        .save(err => {
            if (err) {
                logger.error('Error adding job to queue', err, dateTimeNowFormated());
            } else {
                logger.log('Job added to queue', job.id, dateTimeNowFormated());
            }
        });
    return job;
};

queue.process('query-queue-exec', WORKERS_NUMBER, async (job, done) => {
    const { id: queryId } = job.data;
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
    done();
});

// ###############################################################
// ###############################################################



// set status of query to error with some appropriate msg
queue.on('job failed', (id, err) => {
    logger.error('kue failed', id, err, dateTimeNowFormated());
});

queue.on('error', err => {
    logger.error('kue error', err, dateTimeNowFormated());
});

module.exports = {
    addQueryToQueue,
    addQueryToQueue_Exec
};
