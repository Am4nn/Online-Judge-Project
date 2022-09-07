const User = require('../DataBase/Model/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
    try {
        // sign the token
        const token = jwt.sign(
            {
                user: req.existingUser._id
            },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).status(200).json({ msg: "Logged In" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const registerController = async (req, res) => {
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
                user: savedUser._id
            },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).status(200).json({ msg: "Registered" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Error" });
    }
}

const logoutController = (req, res) => {
    return res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
    }).status(200).json({ msg: "Logged Out" });
}

const loggedInController = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json(false);

        jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json(true);
    } catch (err) {
        res.json(false);
    }
}

module.exports = {
    loginController,
    registerController,
    logoutController,
    loggedInController
};