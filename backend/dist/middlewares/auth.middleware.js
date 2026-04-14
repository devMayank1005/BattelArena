import jwt from 'jsonwebtoken';
import env from '../config/config.js';
import userModel from '../models/user.model.js';
import redisClient from '../config/cache.js';
const authMiddleware = async (req, res, next) => {
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
        const decodedToken = jwt.verify(token, env.JWT_SECRET);
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
    }
    catch (_error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error 💥',
        });
    }
};
export default authMiddleware;
