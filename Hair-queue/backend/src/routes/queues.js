import express from 'express';
import {
  joinQueue,
  getMyQueue,
  leaveQueue,
  getShopQueue,
  callNextCustomer,
  getQueueStatus
} from '../controllers/queueController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/join', joinQueue);
router.get('/me', getMyQueue);
router.put('/:id/leave', leaveQueue);
router.get('/shop/:shopId/status', getQueueStatus);

// Barber routes
router.get('/shop/:shopId', authorize('barber', 'shop_owner', 'admin'), getShopQueue);
router.put('/shop/:shopId/next', authorize('barber', 'shop_owner', 'admin'), callNextCustomer);

export default router;