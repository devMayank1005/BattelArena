import cors from 'cors';
import express from 'express';
import { runBattle, streamBattle } from './services/graph.ai.service.js';
import type { BattleEvent } from './services/graph.ai.service.js';

const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error('CORS origin not allowed'));
        },
        methods: ['GET', 'POST'],
        credentials: true,
    }),
);

function sendSse(res: express.Response, event: string, payload: unknown) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

app.get('/', (_req, res) => {
    res.status(200).json({
        ok: true,
        service: 'battelarena-api',
    });
});

app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
});

app.post('/invoke', async (req, res) => {
    try {
        const { input } = req.body;

        if (!input || typeof input !== 'string') {
            res.status(400).json({
                success: false,
                message: 'input is required and must be a string',
            });
            return;
        }

        const result = await runBattle(input);

        res.status(200).json({
            message: 'Graph executed successfully',
            success: true,
            result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to run battle',
        });
    }
});

app.post('/invoke/stream', async (req, res) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
        res.status(400).json({
            success: false,
            message: 'input is required and must be a string',
        });
        return;
    }

    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        const result = await streamBattle(input, (event: BattleEvent) => {
            sendSse(res, event.type, event);
        });

        sendSse(res, 'complete', {
            success: true,
            result,
        });
        res.end();
    } catch (error) {
        sendSse(res, 'error', {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to run battle',
        });
        res.end();
    }
});

export default app;