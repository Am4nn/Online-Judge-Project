const express = require('express');
const router = express.Router();
const {
    getLogsController, logFromClient
} = require('../controllers/experimental');
const { authProvider } = require('../middlewares');
const { loggingMiddleware } = require('../middlewares');

// api/explore/
router.get('/logs', loggingMiddleware, authProvider, getLogsController);
router.post('/log', loggingMiddleware, authProvider, logFromClient);

module.exports = router;