// Requirements: Bull requires a Redis version greater than or equal to 2.8.18

const Queue = require('bull');
const {
    Authorization, Query,
    Question, User,
} = require('../DataBase/database');
const codeExecutorDir = `./codeExecutor${(process.env.NO_DOCKER ? "_nodockerv" : "_dockerv")}`;
const {
    deleteFile, execCode,
    execCodeAgainstTestcases, languageSpecificDetails
} = require(codeExecutorDir);
const { dateTimeNowFormated, logger } = require('../utils');

logger.log("Redis version greater than or equal to 2.8.18 Required !");

const WORKERS_NUMBER = 5;
const QUEUE_CONFIG = {
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
    }
};

const queryQueue = new Queue('query-queue', QUEUE_CONFIG);

queryQueue.process(WORKERS_NUMBER, async ({ data }) => {
    const query = data;
    const startTime = new Date();
    try {
        let response = await execCodeAgainstTestcases(query.filepath, query.testcase, query.language);

        await Query.getQueryByIdAndUpdate(query._id, {
            startTime,
            completeTime: new Date(),
            status: 'success',
            output: response
        });

        await Question.incrNoOfSuccess(query.quesId);

        if (query.username && !Authorization.isGuest(query.username)) {
            await User.addSolvedQuestionToUser(query.username, query.quesId);
        }

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
            // TODO: Update 'Solution.class' to id.class
            deleteFile(
                (query.language === 'java') ? 'Solution.class' : ((query.filepath.split('.')[0]) + '.' + languageSpecificDetails[query.language].compiledExtension)
            );
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


const addQueryToQueue = async query => {
    await queryQueue.add(query);
}





// ###############################################################





const queryQueue_exec = new Queue('query-queue-exec', QUEUE_CONFIG);

queryQueue_exec.process(WORKERS_NUMBER, async ({ data }) => {
    const query = data;
    const startTime = new Date();
    try {
        let response = await execCode(query.filepath, query.language, query.input);

        await Query.getQueryByIdAndUpdate(query._id, {
            startTime,
            completeTime: new Date(),
            status: 'success',
            output: response,
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
                output: error,
            });
        } else {
            logger.log('Error in queryQueue: ', error, dateTimeNowFormated());
        }
    } finally {
        if (query && query.filepath) deleteFile(query.filepath);
        if (query && query.filepath && languageSpecificDetails[query.language].compiledExtension) {
            // TODO: Update 'Solution.class' to id.class
            deleteFile(
                (query.language === 'java') ? 'Solution.class' : ((query.filepath.split('.')[0]) + '.' + languageSpecificDetails[query.language].compiledExtension)
            );
        }
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

const addQueryToQueue_Exec = async (query) => {
    await queryQueue_exec.add(query);
}



module.exports = {
    addQueryToQueue,
    addQueryToQueue_Exec
};
