const express = require('express');
const router = express.Router();
const {
    statusController,
    verdictController,
    problemsController,
    leaderboardController,
    detailedProblemController,
    codesController,
    codeExecutor
} = require('../controllers/explore');

// api/explore/
router.get('/problems', problemsController);
router.get('/problems/:id', detailedProblemController);
router.post('/problems/:id', verdictController);
router.get('/status/:queryId', statusController);
router.get('/leaderboard', leaderboardController);
router.get('/getcode/:codeId', codesController);
router.post('/codeExecutor', codeExecutor);

module.exports = router;