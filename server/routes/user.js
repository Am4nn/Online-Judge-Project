const express = require('express');
const router = express.Router();
const {
    loginValidator,
    registerValidator
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController
} = require('../controllers/user');

router.post('/login', loginValidator, loginController);
router.post('/register', registerValidator, registerController);
router.get('/logout', logoutController);
router.get('/loggedIn', loggedInController);

module.exports = router;