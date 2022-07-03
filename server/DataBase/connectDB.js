// MONGODB 
const mongoose = require('mongoose')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/oj-server';

const connectDB = () => {
    mongoose.connect(dbUrl)
        .then(() => {
            console.log("Database Connected !!!");
        })
        .catch(error => {
            console.log("Oh no MONGOOSE Error !!!");
            console.log(error);
        });
}

module.exports = connectDB;