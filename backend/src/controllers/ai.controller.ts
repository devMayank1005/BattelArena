import { invokeGraph } from '../services/graph.service.js';
import { type Request, type Response } from 'express';

const battleController = async (req: Request, res: Response) => {
	try {
		const { query } = req.body;
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
	} catch (error: any) {
		console.error('Battle Controller Error:', error);
		return res.status(500).json({
			message: error.message || 'Internal server error',
		});
	}
};

export { battleController };
