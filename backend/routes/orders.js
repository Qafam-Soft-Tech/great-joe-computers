import express from 'express';
import { createOrder, getUserOrders, getAllOrders, verifyPayment } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/admin', protect, authorize('admin'), getAllOrders);
router.post('/verify', protect, verifyPayment);

export default router;