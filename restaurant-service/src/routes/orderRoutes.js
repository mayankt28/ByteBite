import express from 'express';
import { getPendingOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getPendingOrders);
router.put('/:orderId', updateOrderStatus);

export default router;
