const express = require('express');
const router = express.Router();
const {
    statusController,
    verdictController,
    problemsController,
    leaderboardController,
    detailedProblemController
} = require('../controllers/explore');

// api/explore/
router.get('/problems', problemsController);
router.get('/problems/:id', detailedProblemController);
router.post('/problems/:id', verdictController);
router.get('/status/:queryId', statusController);
router.get('/leaderboard', leaderboardController);

module.exports = router;