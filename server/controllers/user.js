const User = require('../DataBase/Model/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
    console.log('POST /api/user/login');
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
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const registerController = async (req, res) => {
    console.log('POST /api/user/register');
    try {
        const { name, username, email, password } = req.body;

        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // save a new user account to the db
        const newUser = new User({
            name,
            username,
            email,
            passwordHash
        });

        const savedUser = await newUser.save();

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
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const logoutController = (req, res) => {
    console.log('GET /api/user/logout');
    return res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        // secure: true,
        // sameSite: "none",
    }).status(200).json({ msg: "Logged Out" });
}

const loggedInController = async (req, res) => {
    console.log('GET /api/user/loggedIn');
    // console.info('req', "body: ", req.body, "secret: ", req.secret, "cookies: ", req.cookies);
    try {
        if (!req.cookies || !req.cookies.token) return res.json(false);

        const token = req.cookies.token;
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verified.user);

        res.status(200).json({
            status: true,
            name: user.name,
            email: user.email,
            username: user.username,
            solvedQuestions: user.solvedQuestions
        });
    } catch (err) {
        console.error(err);
        res.json({ status: false });
    }
}

module.exports = {
    loginController,
    registerController,
    logoutController,
    loggedInController
};