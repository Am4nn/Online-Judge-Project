const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { dateTimeNowFormated } = require('../utils');
const { createNewUser, getUserById, findOneUser } = require('../DataBase/database');

const loginController = async (req, res) => {
    console.log('POST /api/user/login', dateTimeNowFormated());
    try {
        // sign the token
        const token = jwt.sign(
            {
                user: req.existingUser._id,
                username: req.existingUser.username
            },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
        }).status(200).json({ msg: "Logged In" });
    } catch (err) {
        console.error(err, dateTimeNowFormated());
        res.status(500).json({ error: "Internal Error" });
    }
}

const registerController = async (req, res) => {
    console.log('POST /api/user/register', dateTimeNowFormated());
    try {
        const { name, username, email, password } = req.body;

        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // save a new user account to the db
        const savedUser = await createNewUser({ name, username, email, passwordHash });

        // sign the token
        const token = jwt.sign(
            {
                user: savedUser._id,
                username: savedUser.username
            },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
        }).status(200).json({ msg: "Registered" });
    } catch (err) {
        console.error(err, dateTimeNowFormated());
        res.status(500).json({ error: "Internal Error" });
    }
}

const logoutController = (req, res) => {
    console.log('GET /api/user/logout', dateTimeNowFormated());
    return res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: "none",
    }).status(200).json({ msg: "Logged Out" });
}

const loggedInController = async (req, res) => {
    console.log('GET /api/user/loggedIn', dateTimeNowFormated());
    try {
        if (!req.cookies || !req.cookies.token) return res.json(false);

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await getUserById(verified.user);

        res.status(200).json({
            status: true,
            name: user.name,
            email: user.email,
            username: user.username,
            solvedQuestions: user.solvedQuestions
        });
    } catch (err) {
        console.error(err, dateTimeNowFormated());
        res.json({ status: false });
    }
}

const changePasswordController = async (req, res) => {
    console.log('PUT /api/user/changePassword', dateTimeNowFormated());
    try {
        let { username, email, password, newPassword } = req.body;
        username = username ? username.trim() : '';
        email = email ? email.trim() : '';

        const existingUser = await findOneUser({ username, email });
        if (!existingUser || (existingUser.username !== username) || (existingUser.email !== email))
            return res.status(401).json({ error: 'Wrong email or username or password.' });
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.passwordHash
        );
        if (!passwordCorrect)
            return res.status(401).json({ error: 'Wrong email or username or password.' });

        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);
        existingUser.passwordHash = passwordHash;
        await existingUser.save();
        res.status(200).json({ msg: "Password Changed" });
    } catch (error) {
        console.error(error, dateTimeNowFormated());
        res.status(500).json({ error });
    }
}

module.exports = {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
};