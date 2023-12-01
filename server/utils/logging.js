const { Console } = require("console");
const fs = require("fs");
const path = require("path");
const Async = require("async");
const { Socket } = require("../socketHandler");
const { Logs } = require("../DataBase/database");

const stdoutDir = path.join(__dirname, "../server.log");
const stderrDir = path.join(__dirname, "../server.error");

const ConsoleLogger = new Console({
    stdout: fs.createWriteStream(stdoutDir, { flags: 'a' }),
    stderr: fs.createWriteStream(stderrDir, { flags: 'a' }),
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Kolkata', // India time zone
    timeZoneName: 'short',
});


const LogQueue = Async.queue(async logData => {
    try {
        await Logs.createNewLog(logData);
    } catch (error) {
        ConsoleLogger.error("Error while inserting log into the database:", error);
    }
}, 1); // Limit concurrency to 1 for sequential processing

const logging = (type, ...args) => {
    const msg = args.join(' ');
    // Emit Socket Logger Event
    if (Socket.getSocketInstance() && Socket.getConnectedUsers().length) {
        Socket.getSocketInstance().emit(`logger-new-${type}`, msg);
    }
    // Handle Development Server Logging
    if (process.env.NODE_ENV !== "production") {
        console[type](msg);
    }
    // Handle Asynchronous Logging to Database
    LogQueue.push({ type, msg: msg.trim() });

    return ConsoleLogger[type](...args);
}

const logger = {
    log: (...args) => logging('log', ...args),
    error: (...args) => logging('error', ...args)
}

const dateTimeNowFormated = () => {
    return ((new Date()).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }));
}

module.exports = {
    logger,
    dateTimeNowFormated
};