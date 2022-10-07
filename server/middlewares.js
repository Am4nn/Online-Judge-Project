const jwt = require("jsonwebtoken");
const User = require('./DataBase/Model/User');
const bcrypt = require('bcryptjs');

const loginValidatorHelper = async (req, res, next, credential, credentialName, password) => {

    let existingUser = undefined;
    credentialName === 'email' && (existingUser = await User.findOne({ email: credential }));
    credentialName === 'username' && (existingUser = await User.findOne({ username: credential }));

    if (!existingUser)
        return res.status(401).json({ error: `Wrong ${credentialName} or password.` });

    const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash
    );
    if (!passwordCorrect)
        return res.status(401).json({ error: `Wrong ${credentialName} or password.` });

    req.existingUser = existingUser;
    next();
}

const loginValidator = async (req, res, next) => {

    let { email, username, password } = req.body;

    username = username ? username.trim() : '';

    try {
        if (!password || !(email || username))
            return res.status(400).json({ error: `Please enter all required fields. Missing : (email or username)${!password ? ', password' : ''}` });

        await loginValidatorHelper(req, res, next, (email ? email : username), (email ? 'email' : 'username'), password)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const registerValidator = async (req, res, next) => {

    let { name, username, email, password, passwordVerify } = req.body;

    name = name ? name.trim() : '';
    username = username ? username.trim() : '';

    try {
        if (!name || !username || !email || !password || !passwordVerify)
            return res.status(400).json({
                error: `Please enter all required fields.  Missing :${!name ? ' name' : ''}${!username ? ' username' : ''}${!email ? ' email' : ''}${!password ? ' password' : ''}${!passwordVerify ? ' passwordVerify' : ''}`
            });

        if (name.length >= 10)
            return res.status(400).json({
                error: "Name should be less that 10 characters"
            });

        if (username.length >= 10 || username.length < 4)
            return res.status(400).json({
                error: "Username should be less that 10 characters and greater than or equal to 4 characters"
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

        const existingUserE = await User.findOne({ email });
        if (existingUserE)
            return res.status(400).json({
                error: "An account with this email already exists.",
            });

        const existingUserU = await User.findOne({ username });
        if (existingUserU)
            return res.status(400).json({
                error: "An account with this username already exists.",
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
        req.username = verified.username;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Unauthorized" });
    }
}

const authProvider = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) new Error("Unauthorized");

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;
        req.username = verified.username;

    } catch (err) {
        req.user = undefined;
        req.username = 'guest';
    }

    next();
}

module.exports = { loginValidator, registerValidator, authValidator, authProvider };