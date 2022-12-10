const express = require('express');
const router = express.Router();
const {
    getLogsController, logFromClient
} = require('../controllers/experimental');
const { authProvider } = require('../middlewares');

// api/explore/
router.get('/logs', authProvider, getLogsController);
router.post('/log', authProvider, logFromClient);

module.exports = router;