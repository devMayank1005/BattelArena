import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import env from './config/config.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

void __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: env.FRONTEND_ORIGIN,
        credentials: true,
    }),
);
app.use(passport.initialize());
passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URI,
        },
        (_, __, profile, done) => {
            return done(null, profile);
        },
    ),
);
app.use(morgan('dev'));
app.use(cookieParser());
const publicPath = path.resolve(process.cwd(), 'public');
app.use(express.static(publicPath));

app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/auth', userRoutes);

app.get('/', (_req, res) => {
    res.status(200).json({
        ok: true,
        service: 'battelarena-api',
    });
});

app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
});

app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
        return next();
    }

    res.sendFile(path.join(publicPath, 'index.html'));
});

export default app;