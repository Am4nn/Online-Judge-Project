const fs = require('fs');
const path = require("path");
const { Authorization } = require('../DataBase/database');
const { dateTimeNowFormated, logger } = require('../utils');

const stdoutDir = path.join(__dirname, "../server.log");
const stderrDir = path.join(__dirname, "../server.error");

const getLogsController = (req, res) => {
    logger.log('GET /api/experimental/logs', dateTimeNowFormated());
    try {
        if (!Authorization.isAdmin(req.username))
            return res.status(401).json("Unautherized");
        const stdoutTxt = fs.readFileSync(stdoutDir).toString();
        const stderrTxt = fs.readFileSync(stderrDir).toString();
        return res.status(200).json({ stdoutTxt, stderrTxt });
    } catch (error) {
        logger.error(error, dateTimeNowFormated());
        return res.status(400).json(error);
    }
}

module.exports = {
    getLogsController
}
