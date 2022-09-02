const jwt = require("jsonwebtoken");
const User = require('./DataBase/Model/User');
const bcrypt = require('bcryptjs');

const loginValidator = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        if (!email || !password)
            return res.status(400).json({ error: `Please enter all required fields. Missing : ${!email ? 'email' : ''}${!password ? ' password' : ''}` });

        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(401).json({ error: "Wrong email or password." });

        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.passwordHash
        );
        if (!passwordCorrect)
            return res.status(401).json({ error: "Wrong email or password." });

        req.existingUser = existingUser;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const registerValidator = async (req, res, next) => {

    const { name, email, password, passwordVerify } = req.body;

    try {
        if (!name || !email || !password || !passwordVerify)
            return res.status(400).json({
                error: `Please enter all required fields.  Missing : ${!name ? 'name' : ''}${!email ? ' email' : ''}${!password ? ' password' : ''}${!passwordVerify ? ' passwordVerify' : ''}`
            });

        if (name.length >= 10)
            return res.status(400).json({
                error: "Name should be less that 10 characters"
            });

        if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)))
            return res.status(400).json({
                error: "Email is not valid"
            });

        if (password.length < 6)
            return res.status(400).json({
                error: "Please enter a password of at least 6 characters.",
            });

        if (password !== passwordVerify)
            return res.status(400).json({
                error: "Please enter the same password twice.",
            });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                error: "An account with this email already exists.",
            });

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const authValidator = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = { loginValidator, registerValidator, authValidator };