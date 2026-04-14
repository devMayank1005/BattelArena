import userModel from '../models/user.model.js';
import env from '../config/config.js';
import redisClient from '../config/cache.js';
import jwt from 'jsonwebtoken';
const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await userModel.findOne({
            email,
        });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        const newUser = await userModel.create({ email, password });
        const token = jwt.sign({
            id: newUser._id,
        }, env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully ✅',
            user: {
                id: newUser._id,
                email: newUser.email,
            },
        });
    }
    catch (_error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({
            email,
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }
        const token = jwt.sign({
            id: user._id,
        }, env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: 'User logged in successfully ✅',
            user: {
                id: user._id,
                email: user.email,
            },
        });
    }
    catch (_error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'User not logged in',
            });
        }
        await redisClient.set(token, Date.now(), 'EX', 3 * 24 * 60 * 60);
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'User logged out successfully ✅',
        });
    }
    catch (_error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
const getmeController = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        const loggedInUser = await userModel.findById(req.user.id);
        if (!loggedInUser) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'User found successfully ✅',
            user: {
                id: loggedInUser._id,
                email: loggedInUser.email,
            },
        });
    }
    catch (_error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
const googleCallbackController = async (req, res) => {
    try {
        const profile = req.user;
        if (!profile || !profile.emails || !profile.emails[0].value) {
            return res.redirect(env.FRONTEND_URL + '/auth/login');
        }
        const email = profile.emails[0].value;
        let user = await userModel.findOne({ email });
        if (!user) {
            user = await userModel.create({ email });
        }
        const token = jwt.sign({
            id: user._id,
        }, env.JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(env.FRONTEND_URL + '/');
    }
    catch (_error) {
        res.redirect(env.FRONTEND_URL + '/auth/login');
    }
};
export { registerController, loginController, logoutController, getmeController, googleCallbackController, };
