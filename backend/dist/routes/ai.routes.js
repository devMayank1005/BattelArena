import { Router } from 'express';
import { battleController, battleStreamController } from '../controllers/ai.controller.js';
const router = Router();
router.post('/invoke', battleController);
router.post('/invoke/stream', battleStreamController);
export default router;
