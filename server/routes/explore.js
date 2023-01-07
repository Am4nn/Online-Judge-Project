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
const { loggingMiddleware } = require('../middlewares');

// api/explore/
router.get('/problems', loggingMiddleware, problemsController);
router.get('/problems/:id', loggingMiddleware, detailedProblemController);
router.post('/problems/:id', loggingMiddleware, verdictController);
router.get('/status/:queryId', loggingMiddleware, statusController);
router.get('/leaderboard', loggingMiddleware, leaderboardController);
router.get('/getcode/:codeId', loggingMiddleware, codesController);
router.post('/codeExecutor', loggingMiddleware, codeExecutor);

module.exports = router;