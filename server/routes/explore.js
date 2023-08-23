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
const { loggingMiddleware, checkExecServiceAvailable } = require('../middlewares');

// api/explore/

router.get('/problems', loggingMiddleware, problemsController);
router.get('/problems/:id', loggingMiddleware, detailedProblemController);
router.get('/leaderboard', loggingMiddleware, leaderboardController);
router.get('/getcode/:codeId', loggingMiddleware, codesController);
router.get('/status/:queryId', loggingMiddleware, statusController);

// routes for execution of code
router.post('/problems/:id', loggingMiddleware, checkExecServiceAvailable, verdictController);
router.post('/codeExecutor', loggingMiddleware, checkExecServiceAvailable, codeExecutor);


module.exports = router;