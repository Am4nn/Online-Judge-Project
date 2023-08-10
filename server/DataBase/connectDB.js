// MONGODB 
const mongoose = require('mongoose');
const { dateTimeNowFormated, logger } = require('../utils/logging');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/oj-server';

const connectDB = () => {
    return mongoose.connect(dbUrl)
        .then(() => {
            logger.log("Database Connected !!!");
        })
        .catch(error => {
            logger.error("Oh no MONGOOSE Error !!!", dateTimeNowFormated());
            logger.error(error);
        });
}

module.exports = {
    connectDB
};