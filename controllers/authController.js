const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            const error = new Error(errorMessage);
            error.statusCode = 422;
            throw error;
        }
        const {email, username, password} = req.body;
        const hashedPwd = await bcrypt.hash(password, 10);

        const user = new User({
            username: username,
            email: email,
            password: hashedPwd
        })
        await user.save();

        res.status(201).json({message: "User created!"})
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const login = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            const error = new Error(errorMessage);
            error.statusCode = 422;
            throw error;
        }
        const token = jwt.sign(
            {
                email: req.user.email,
                userId: req.user._id.toString()
            },
            'somesupersecretstringhere',
            {
                expiresIn: "1h"
            }
        )
        res.status(200).json({
            token: token, 
            userId: req.user._id.toString(), 
            message: "Logged in successfully"
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = {signup, login};