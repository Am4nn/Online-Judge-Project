const express = require('express');
const router = express.Router();
const { problemsController,
    detailedProblemController,
    verdictController,
    leaderboardController } = require('../controllers/explore');

// api/explore/
router.get('/problems', problemsController);
router.get('/problems/:id', detailedProblemController);
router.post('/problems/:id', verdictController);
router.get('/leaderboard', leaderboardController);

module.exports = router;