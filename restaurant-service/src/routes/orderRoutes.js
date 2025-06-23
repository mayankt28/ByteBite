import express from 'express';
import { getPendingOrders, updateOrderStatus } from '../controllers/orderController.js';
import { checkAdminOrRestaurantEmployee } from '../middlewares/authMiddleware.js';

const router = express.Router();

///api/orders?restaurantId=xyz
router.get('/',checkAdminOrRestaurantEmployee, getPendingOrders);
router.put('/:orderId',checkAdminOrRestaurantEmployee, updateOrderStatus);

export default router;
