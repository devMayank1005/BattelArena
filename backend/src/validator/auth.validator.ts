import { body, validationResult } from 'express-validator';
import { type Request, type Response, type NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array()[0]?.msg,
		});
	}
	next();
};

const authValidator = [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Invalid email')
		.normalizeEmail(),

	body('password')
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),

	validate,
];

export default authValidator;
