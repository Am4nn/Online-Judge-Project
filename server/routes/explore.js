const express = require('express');
const router = express.Router();
const { problembankController,
    detailedProblemController,
    verdictController,
    leaderboardController } = require('../controllers/explore');

// api/explore/problembank/
router.get('/problembank', problembankController);
router.get('/problem/:id', detailedProblemController);
router.post('/problem/:id', verdictController); // unknown
router.get('/leaderboard', leaderboardController);

module.exports = router;