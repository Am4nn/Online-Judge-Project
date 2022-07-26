const express = require('express');
const router = express.Router();
const {
    statusController,
    verdictController,
    problemsController,
    leaderboardController,
    detailedProblemController,
    codesController
} = require('../controllers/explore');

// api/explore/
router.get('/problems', problemsController);
router.get('/problems/:id', detailedProblemController);
router.post('/problems/:id', verdictController);
router.get('/status/:queryId', statusController);
router.get('/leaderboard', leaderboardController);
router.post('/getcode', codesController);

module.exports = router;