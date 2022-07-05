if (process.env.NODE_ENV !== "production") { // if in development
    require('dotenv').config(); // .env file var -> process.env
}

const express = require('express');
const cors = require('cors');
const test = require('./routes/test');
const explore = require('./routes/explore');
const user = require('./routes/user');
const app = express();
const connectDB = require('./DataBase/connectDB');
const Question = require('./DataBase/Model/Question');

async function seedDB() {
    await Question.deleteMany({});
    const newQuestion = new Question({
        difficulty: 'medium',
        name: 'Simple Search',
        description: 'A simple searching question, search key in an array',
        examples: [
            {
                input: 'key: 7,  arr[] = [5, 9, 6, 7, 3]',
                output: '3',
                explaination: 'in arr array 7 key is at 3rd index'
            },
            {
                input: 'key: 18,  arr[] = [94, 12, 78, 23, 19, 48, 12, 36, 45]',
                output: '1',
                explaination: "in arr array 18 key's first occurance is at 3rd index"
            }
        ],
        noOfSubm: 185,
        noOfSuccess: 94,
        code: 'SIMSRCH'
    });
    await newQuestion.save();
    const allQuestions = await Question.find({});
    console.log(...allQuestions);
}


connectDB();

// try {
// seedDB();
// } catch (err) {
// console.log(err);
// }

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// set api routes
app.use('/api/test', test);

// set api route to get all questions
app.use('/api/explore', explore);

// user login and rgister
app.use('/api/user', user);

// set 404 route

// set handle error

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
})