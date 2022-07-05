const { getQuestionList } = require('../DataBase/database');

const problemsController = async (req, res) => {
    const questions = await getQuestionList();
    res.status(200).json(questions);
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
    problemsController,
    detailedProblemController,
    verdictController,
    leaderboardController
};