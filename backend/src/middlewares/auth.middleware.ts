import jwt from 'jsonwebtoken';
import env from '../config/config.js';
import userModel from '../models/user.model.js';
import redisClient from '../config/cache.js';
import { type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';

declare global {
	namespace Express {
		interface User {
			id?: mongoose.Types.ObjectId | string;
			email?: string;
		}

		interface Request {
			user?: User;
		}
	}
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'User not logged in 🔐',
			});
		}

		const isTokenBlacklisted = await redisClient.get(token);
		if (isTokenBlacklisted) {
			return res.status(401).json({
				success: false,
				message: 'Invalid token 📜',
			});
		}
		const decodedToken = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & { id: string };
		const user = await userModel.findById(decodedToken.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found 🕵️',
			});
		}
		req.user = {
			id: user._id,
			email: user.email,
		};
		next();
	} catch (_error: any) {
		res.status(500).json({
			success: false,
			message: 'Internal server error 💥',
		});
	}
};

export default authMiddleware;
