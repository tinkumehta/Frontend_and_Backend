import express from 'express';
import { joinQueue, getMyQueue } from '../controllers/queueController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/join', joinQueue);
router.get('/me', getMyQueue);

export default router;