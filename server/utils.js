const logger = () => { }

const dateTimeNowFormated = () => {
    return ((new Date()).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' }));
}

module.exports = {
    logger,
    dateTimeNowFormated
};