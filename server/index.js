if (process.env.NODE_ENV !== "production") { // if in development
    require('dotenv').config(); // .env file var -> process.env
}

const express = require('express');
const cors = require('cors');
const explore = require('./routes/explore');
const user = require('./routes/user');
const app = express();
const { connectDB } = require('./DataBase/connectDB');

connectDB();

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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