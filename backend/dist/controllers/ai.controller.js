import { invokeGraph } from '../services/graph.service.js';
import { streamBattle } from '../services/graph.ai.service.js';
const battleController = async (req, res) => {
    try {
        const query = req.body?.query ?? req.body?.input;
        if (!query) {
            return res.status(400).json({
                message: 'Query is required',
            });
        }
        const result = await invokeGraph(query);
        return res.status(200).json({
            success: true,
            message: 'Graph invoked successfully',
            result,
        });
    }
    catch (error) {
        console.error('Battle Controller Error:', error);
        return res.status(500).json({
            message: error.message || 'Internal server error',
        });
    }
};
const battleStreamController = async (req, res) => {
    try {
        const query = req.body?.query ?? req.body?.input;
        if (!query) {
            return res.status(400).json({
                message: 'Query is required',
            });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const sendEvent = (eventType, payload) => {
            res.write(`event: ${eventType}\n`);
            res.write(`data: ${JSON.stringify(payload)}\n\n`);
        };
        await streamBattle(query, (event) => {
            sendEvent(event.type, event);
        });
        res.end();
    }
    catch (error) {
        console.error('Battle Stream Controller Error:', error);
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ message: error.message || 'Internal server error' })}\n\n`);
        res.end();
    }
};
export { battleController, battleStreamController };
