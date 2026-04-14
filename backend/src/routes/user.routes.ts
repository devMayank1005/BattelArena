import { Router } from 'express';
import passport from 'passport';
import authMiddleware from '../middlewares/auth.middleware.js';
import authValidator from '../validator/auth.validator.js';
import {
  getmeController,
  googleCallbackController,
  loginController,
  logoutController,
  registerController,
} from '../controllers/user.controller.js';

const router = Router();

router.post('/signup', authValidator, registerController);
router.post('/login', authValidator, loginController);
router.post('/logout', authMiddleware, logoutController);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/v1/auth/login' }),
  googleCallbackController,
);
router.get('/me', authMiddleware, getmeController);

export default router;