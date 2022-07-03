const express = require('express')
const router = express.Router();
const { testController } = require('../controllers/test');
const { check } = require('express-validator');

router.post('/r1', [
    check('name', 'Not valid name').not().isEmpty(),
    check('email', 'Not valid email').isEmail(),
    check('password', 'password length should be more than or equal to 6 chars').isLength({ min: 6 })
], testController);


module.exports = router;