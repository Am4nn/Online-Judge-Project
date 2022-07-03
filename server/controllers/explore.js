const problembankController = (req, res) => {
    res.status(200).json('problembankController');
}
const detailedProblemController = (req, res) => {
    res.status(200).json('detailedProblemController');
}
const verdictController = (req, res) => {
    res.status(200).json('verdictController');
}
const leaderboardController = (req, res) => {
    res.status(200).json('leaderboardController');
}

module.exports = {
    problembankController,
    detailedProblemController,
    verdictController,
    leaderboardController
};