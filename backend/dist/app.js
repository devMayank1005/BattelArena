import cors from 'cors';
import express from 'express';
import { runBattle, streamBattle } from './services/graph.ai.service.js';
const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
}));
function sendSse(res, event, payload) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}
app.get('/', async (_req, res) => {
    const result = await runBattle('Write an code for Factorial function in js');
    res.json(result);
});
app.post('/invoke', async (req, res) => {
    const { input } = req.body;
    const result = await runBattle(input);
    res.status(200).json({
        message: 'Graph executed successfully',
        success: true,
        result,
    });
});
app.post('/invoke/stream', async (req, res) => {
    const { input } = req.body;
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    try {
        const result = await streamBattle(input, (event) => {
            sendSse(res, event.type, event);
        });
        sendSse(res, 'complete', {
            success: true,
            result,
        });
        res.end();
    }
    catch (error) {
        sendSse(res, 'error', {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to run battle',
        });
        res.end();
    }
});
export default app;
