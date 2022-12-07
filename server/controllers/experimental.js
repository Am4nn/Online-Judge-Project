const fs = require('fs');
const path = require("path");
const { Authorization } = require('../DataBase/database');
const { dateTimeNowFormated, logger } = require('../utils');

const stdoutDir = path.join(__dirname, "../server.log");
const stderrDir = path.join(__dirname, "../server.error");

const defaultNLines = 2000;

const readLastNLines = (filePath, start, nLines = defaultNLines) => {
    const fileBuffer = fs.readFileSync(filePath).toString().split('\n').reverse()
    const end = (start + nLines <= fileBuffer.length) ? (start + nLines) : undefined;
    return fileBuffer.slice(start, end).reverse().join('\n');
}

const getLogsController = (req, res) => {
    logger.log('GET /api/experimental/logs', dateTimeNowFormated());
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

module.exports = {
    getLogsController
}
