// if in development
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // .env file var -> process.env
} else console.log("In Production !");

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const explore = require('./routes/explore');
const user = require('./routes/user');
const notes = require('./routes/notes');
const path = require('path');
const { connectDB } = require('./DataBase/connectDB');
const { initDockerGcc, initDockerPython } = require('./CodeExecuter/codeExecutor_dockerv');

// Establish Connection to Database
connectDB();
// Initiate Docker Containers
initDockerGcc();
initDockerPython();

// parse json request body
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true
}));

// api route to get questions and verdicts
app.use('/api/explore', explore);

// api route to get and post notes
app.use('/api/notes', notes);

// user login and rgister
app.use('/api/user', user);

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
// Set static folder
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
);
// }

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
})
