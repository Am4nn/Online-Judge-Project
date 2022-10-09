const logger = () => { }

const dateTimeNowFormated = () => {
    return ((new Date()).toLocaleString());
}

module.exports = {
    logger,
    dateTimeNowFormated
};