const express = require('express');
const router = express.Router();
const {
    loginValidator,
    registerValidator,
    authProvider
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
} = require('../controllers/user');

router.post('/login', loginValidator, loginController);
router.post('/register', registerValidator, registerController);
router.get('/logout', logoutController);
router.get('/loggedIn', loggedInController);
router.put('/changePassword', changePasswordController);

module.exports = router;