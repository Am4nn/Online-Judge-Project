// Requirements: Bull requires a Redis version greater than or equal to 2.8.18

const Queue = require('bull');
const Query = require('../DataBase/Model/Query');
const Question = require('../DataBase/Model/Question');

const {
    execPyCode,
    execCppCode
} = require('./codeExecutor_dockerv');

const queryQueue = new Queue('query-queue');
const WORKERS_NUMBER = 5;

queryQueue.process(WORKERS_NUMBER, async ({ data }) => {
    const { id: queryId } = data;
    let query = null;
    try {
        query = await Query.findById(queryId);
        if (!query) {
            throw Error("Query not found");
        }

        query.startTime = new Date();
        let response;
        switch (query.language) {
            case 'cpp':
                response = await execCppCode(query.filepath, query.testcase);
                break;
            case 'py':
                response = await execPyCode(query.filepath, query.testcase);
                break;
            default:
                response = { msg: 'Please select a language / valid language !' };
        }

        query.completeTime = new Date();
        query.status = 'success';
        query.output = response;
        await query.save();

        const question = await Question.findById(query.quesId);
        question.noOfSuccess += 1;
        await question.save();

    } catch (error) {
        if (!error.msg) error = { ...error, msg: 'some server side errors' };

        query.completeTime = new Date();
        query.status = 'error';
        query.output = error;
        await query.save();
    }
    return true;
})


// set status of query to error with some appropriate msg
queryQueue.on('failed', error => {
    console.error(error.data.id, 'failed', error.failedReason);
})

queryQueue.on('error', error => {
    console.error('error', error);
})


const addQueryToQueue = async queryId => {
    await queryQueue.add({ id: queryId });
}

module.exports = {
    addQueryToQueue
};