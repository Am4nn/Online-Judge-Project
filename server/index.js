const { dateTimeNowFormated, logger } = require('./utils');


// If not in production
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config(); // .env file variables -> process.env
}
logger.log(`In ${process.env.NODE_ENV} env !`);

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const explore = require('./routes/explore');
const user = require('./routes/user');
const notes = require('./routes/notes');
const experimental = require('./routes/experimental');
const path = require('path');
const http = require('http');
const { connectDB } = require('./DataBase/connectDB');
const { initAllDockerContainers } = require('./CodeExecuter/codeExecutor_dockerv');
const { Socket } = require('./socketHandler');

// Establish Connection to Database
connectDB();
// Initiate All Docker Containers
initAllDockerContainers();

// parse json request body
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// api route to get questions and verdicts
app.use('/api/explore', explore);

// api route to get and post notes
app.use('/api/notes', notes);

// user login and rgister
app.use('/api/user', user);

// experimental routes
app.use('/api/experimental', experimental);

// Serve Static Assets
// Set Static Folder
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
);

// setup socket connection
const server = http.createServer(app);
Socket.registerSocketServer(server);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    logger.log(`Server running on PORT ${port}`, dateTimeNowFormated());
});
