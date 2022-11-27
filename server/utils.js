const { Console } = require("console");
const fs = require("fs");
const path = require("path");

const stdoutDir = path.join(__dirname, "./server.log");
const stderrDir = path.join(__dirname, "./server.error");

const logger = new Console({
    stdout: fs.createWriteStream(stdoutDir, { flags: 'a' }),
    stderr: fs.createWriteStream(stderrDir, { flags: 'a' }),
});

const dateTimeNowFormated = () => {
    return ((new Date()).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }));
}

module.exports = {
    logger,
    dateTimeNowFormated
};