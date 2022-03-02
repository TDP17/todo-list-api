import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'

import User from '../Models/user.js'

import isAuthorized from '../Utils/isAuthorized.js';

const router = express.Router();

router.post('/register',
    [
        body('password')
            .isLength({ min: 8 }).withMessage("Password must be minimum 8 characters"),
        body('username')
            .isLength({ min: 3, max: 20 }).withMessage("Username must be of 3-20 characters").trim().escape()
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        try {
            const sameUser = await User.findOne({ where: { username: username } });
            if (sameUser) {
                return res.status(409).json("Given username already exists in our database");
            }
            else {
                if (password !== confirmPassword) {
                    return res.status(400).json("Passwords do not match")
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const newUser = { username: username, password: hashedPassword };
                const saveUser = await User.create(newUser);
                if (saveUser) {
                    return res.status(201).json("User Created");
                }
            }
        } catch (error) {
            res.status(503).json({ error: "Internal server issues, please try again later" });
        }
    })

router.post('/login',
    [
        body('password')
            .trim().escape(),
        body('username')
            .trim().escape()
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errorMessage: errors.array()[0].msg });
        }

        const username = req.body.username;
        const password = req.body.password;

        try {
            const user = await User.findOne({ where: { username: username } })
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({
                        username: user.username,
                    },
                        process.env.JWT_TOKEN,
                        { expiresIn: "168h" }
                    )
                    res.cookie(`jwt_token`, token, {
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                        secure: true,
                        httpOnly: true,
                        sameSite: 'none',
                    });
                    res.status(200).json({ username: user.username });
                }
                else {
                    res.status(401).json("Username or password incorrect")
                }
            }
            else {
                res.status(401).json("Username or password incorrect")
            }
        } catch (error) {
            console.log(error);
            res.status(503).json({ error: "Internal server issues, please try again later" });
        }
    })

router.get('/getJWT', isAuthorized, (req, res) => {
    res.status(200).json("Authorized");
})

router.get('/logout', isAuthorized, (req, res) => {
    res.clearCookie('jwt_token', {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: 'none',
    });
    res.status(200).json("Logged Out");
})

export default router;