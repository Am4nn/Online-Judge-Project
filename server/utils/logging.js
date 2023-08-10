const { Console } = require("console");
const fs = require("fs");
const path = require("path");
const { Socket } = require("../socketHandler");

const stdoutDir = path.join(__dirname, "../server.log");
const stderrDir = path.join(__dirname, "../server.error");

const ConsoleLogger = new Console({
    stdout: fs.createWriteStream(stdoutDir, { flags: 'a' }),
    stderr: fs.createWriteStream(stderrDir, { flags: 'a' }),
});

const logging = (type, ...args) => {
    const msg = args.join(' ');
    // emitSocketLoggerEvent
    if (Socket.getSocketInstance() && Socket.getConnectedUsers().length) {
        Socket.getSocketInstance().emit(`logger-new-${type}`, msg);
        Socket.getSocketInstance().on("join", (data) => {

        })
    }
    // handlerDevelopmentServerLoggig
    if (process.env.NODE_ENV !== "production") {
        console[type](msg);
    }
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