import { Router } from 'express';
import { battleController } from '../controllers/ai.controller.js';

const router = Router();

router.post('/invoke', battleController);

export default router;