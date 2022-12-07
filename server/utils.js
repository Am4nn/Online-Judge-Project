const { Console } = require("console");
const fs = require("fs");
const path = require("path");
const { Socket } = require("./socketHandler");

const stdoutDir = path.join(__dirname, "./server.log");
const stderrDir = path.join(__dirname, "./server.error");

const ConsoleLogger = new Console({
    stdout: fs.createWriteStream(stdoutDir, { flags: 'a' }),
    stderr: fs.createWriteStream(stderrDir, { flags: 'a' }),
});

const emitSocketLoggerEvent = (type, msg) => {
    if (Socket.getSocketInstance() && Socket.getConnectedUsers().length) {
        Socket.getSocketInstance().emit(`logger-new-${type}`, msg);
    }
}

const logger = {
    log: (...args) => {
        emitSocketLoggerEvent('log', args.join(' '));
        ConsoleLogger.log(...args);
    },
    error: (...args) => {
        emitSocketLoggerEvent('error', args.join(' '));
        ConsoleLogger.error(...args);
    }
}

const dateTimeNowFormated = () => {
    return ((new Date()).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }));
}

module.exports = {
    logger,
    dateTimeNowFormated
};