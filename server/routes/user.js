const express = require('express');
const router = express.Router();
const { loginController, registerController, logoutController } = require('../controllers/user');
const { loginValidator, registerValidator } = require('../middlewares');

router.post('/login', loginValidator, loginController);
router.post('/register', registerValidator, registerController);
router.get('/logout', logoutController);

module.exports = router;