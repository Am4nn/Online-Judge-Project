const express = require('express');
const router = express.Router();
const { problemsController,
    detailedProblemController,
    verdictController,
    leaderboardController } = require('../controllers/explore');

// api/explore/problembank/
router.get('/problems', problemsController);
router.get('/problems/:id', detailedProblemController);
router.post('/problem/:id', verdictController); // unknown
router.get('/leaderboard', leaderboardController);

module.exports = router;