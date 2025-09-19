import {Router} from 'express';
import { 
    createOrder, 
    getOrderById, 
    getUserOrders, 
    verifyPayment } from '../controllers/paymentController.js';
import {protect} from '../middleware/auth.js'

 const router = Router();

 router.route('/create-order').post(protect, createOrder);
 router.route('/verify').post(protect, verifyPayment);
 router.route('/orders').get(protect, getUserOrders);
 router.route('/orders/:id').get(protect, getOrderById);

 export default router;