import userModel from '../models/user.model.js';
import env from '../config/config.js';
import redisClient from '../config/cache.js';
import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const authCookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? ('none' as const) : ('lax' as const),
	maxAge: 24 * 60 * 60 * 1000,
	path: '/',
};

const registerController = async (req: Request, res: Response) => {
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
		const token = jwt.sign(
			{
				id: newUser._id,
			},
			env.JWT_SECRET,
			{
				expiresIn: '1d',
			},
		);
		res.cookie('token', token, {
			...authCookieOptions,
		});

		res.status(201).json({
			success: true,
			message: 'User registered successfully ✅',
			user: {
				id: newUser._id,
				email: newUser.email,
			},
		});
	} catch (_error: any) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

const loginController = async (req: Request, res: Response) => {
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

		const token = jwt.sign(
			{
				id: user._id,
			},
			env.JWT_SECRET,
			{
				expiresIn: '1d',
			},
		);
		res.cookie('token', token, {
			...authCookieOptions,
		});

		res.status(200).json({
			success: true,
			message: 'User logged in successfully ✅',
			user: {
				id: user._id,
				email: user.email,
			},
		});
	} catch (_error: any) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

const logoutController = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(400).json({
				success: false,
				message: 'User not logged in',
			});
		}
		await redisClient.set(token, Date.now(), 'EX', 3 * 24 * 60 * 60);
		res.clearCookie('token', {
			httpOnly: true,
			secure: authCookieOptions.secure,
			sameSite: authCookieOptions.sameSite,
			path: '/',
		});
		res.status(200).json({
			success: true,
			message: 'User logged out successfully ✅',
		});
	} catch (_error: any) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

const getmeController = async (req: Request, res: Response) => {
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
	} catch (_error: any) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

const googleCallbackController = async (req: Request, res: Response) => {
	try {
		const profile: any = req.user;
		if (!profile || !profile.emails || !profile.emails[0].value) {
			return res.redirect(env.FRONTEND_URL + '/auth/login');
		}

		const email = profile.emails[0].value;
		let user = await userModel.findOne({ email });

		if (!user) {
			user = await userModel.create({ email });
		}

		const token = jwt.sign(
			{
				id: user._id,
			},
			env.JWT_SECRET,
			{
				expiresIn: '1d',
			},
		);
		res.cookie('token', token, {
			...authCookieOptions,
		});

		res.redirect(env.FRONTEND_URL + '/');
	} catch (_error: any) {
		res.redirect(env.FRONTEND_URL + '/auth/login');
	}
};

export {
	registerController,
	loginController,
	logoutController,
	getmeController,
	googleCallbackController,
};
