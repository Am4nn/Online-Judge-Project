const express = require('express');
const router = express.Router();
const {
    getLogsController
} = require('../controllers/experimental');
const { authProvider } = require('../middlewares');

// api/explore/
router.get('/logs', authProvider, getLogsController);

module.exports = router;