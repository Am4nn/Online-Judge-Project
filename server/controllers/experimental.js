const fs = require('fs');
const path = require("path");
const { Authorization } = require('../DataBase/database');
const { dateTimeNowFormated, logger } = require('../utils/logging');

const stdoutDir = path.join(__dirname, "../server.log");
const stderrDir = path.join(__dirname, "../server.error");

const defaultNLines = 2000;

const readLastNLines = (filePath, start, nLines = defaultNLines) => {
    const fileBuffer = fs.readFileSync(filePath).toString().split('\n').reverse()
    const end = (start + nLines <= fileBuffer.length) ? (start + nLines) : undefined;
    return fileBuffer.slice(start, end).reverse().join('\n');
}

const getLogsController = (req, res) => {
    try {
        const pageNo = (req.query && req.query.pageNo && req.query.pageNo >= 1) ? req.query.pageNo : 1;
        if (!Authorization.isAdmin(req.username))
            return res.status(401).json({ msg: "Unautherized", error: 'Only admin can view this page' });
        const stdoutTxt = readLastNLines(stdoutDir, (pageNo - 1) * defaultNLines);
        const stderrTxt = readLastNLines(stderrDir, (pageNo - 1) * defaultNLines);
        return res.status(200).json({ stdoutTxt, stderrTxt });
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json({ msg: 'Internal Error', error });
    }
}

const logFromClient = (req, res) => {
    try {
        logger.log("Username:", req.username);
        logger.log("LOG:", req.body.msg);
        res.status(200).json('logged');
    } catch (err) {
        logger.error(err, dateTimeNowFormated());
        res.status(500).json(err);
    }
}


module.exports = {
    getLogsController, logFromClient
}
