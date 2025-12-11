import express from 'express';
import { getShops, getShop } from '../controllers/shopController.js';

const router = express.Router();

router.get('/', getShops);
router.get('/:id', getShop);

export default router;