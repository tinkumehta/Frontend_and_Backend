import express from 'express';
import {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  addBarber
} from '../controllers/shopController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getShops);
router.get('/:id', getShop);

router.use(protect);
router.post('/', authorize('shop_owner', 'admin'), createShop);
router.put('/:id', authorize('shop_owner', 'admin'), updateShop);
router.delete('/:id', authorize('shop_owner', 'admin'), deleteShop);
router.post('/:id/barbers', authorize('shop_owner', 'admin'), addBarber);

export default router;