const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {body} = require("express-validator");
const User = require("../models/User");

router.post("/signup", [
    body('username')
        .isLength({ min: 6, max: 15 }).withMessage("Username has to be between 6 and 15 characters long!")
        .isAlphanumeric().withMessage("Enter only letters, numbers or these characters ('.', '*', '&')!")
        .trim().escape(),
    body('email')
        .isEmail().withMessage("Enter a valid email!")
        .normalizeEmail()
        .custom(async (email) => {
            const userExists = await User.findOne({ email: email });
            if (userExists) {
                const error = new Error(`User with email: ${email} already exists`);
                error.statusCode = 409;
                throw error;
            }
            return true;
        }),
    body('password')
        .trim().escape()
        .isLength({ min: 6, max: 15 }).withMessage("Password has to be between 6 and 15 characters long!")
        .isAlphanumeric().withMessage("Password has to be alphanumeric!")
], authController.signup);
router.post("/login", [
    body('email')
        .isEmail().withMessage("Enter a valid email!")
        .normalizeEmail()
        .custom(async (email, { req }) => {
            const userExists = await User.findOne({ email: email });
            if (!userExists) {
                throw new Error(`User with email: ${email} doesn't exist`);
            }
            req.user = userExists;
            return true;
        })
    ,
    body('password')
        .trim().escape()
        .isLength({ min: 6, max: 15 }).withMessage("Password has to be between 6 and 15 characters long!")
        .isAlphanumeric().withMessage("Password has to be alphanumeric!")
        .custom(async (password, { req }) => {
            const hasMatched = await bcrypt.compare(password, req.user.password);
            if (!hasMatched) {
                throw new Error("Password incorrect!");
            }
            return true;
        }),
], authController.login);

module.exports = router;