import express from 'express';
import { placeOrder, getOrderById, getUserOrders, cancelOrder } from '../controllers/orderController.js';
import { sendOrderUpdateToUser } from '../websocket/socketServer.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/',authenticate, placeOrder);
router.get('/:id',authenticate, getOrderById);
router.get('/',authenticate, getUserOrders);
router.patch('/:id/cancel',authenticate, cancelOrder);


// ⚡ Test endpoint to simulate order status update
router.post('/test-update', (req, res) => {
  const { userId, orderId, status } = req.body;

  sendOrderUpdateToUser(userId, {
    type: 'ORDER_STATUS_UPDATE',
    orderId,
    status,
    timestamp: new Date().toISOString(),
  });

  res.json({ message: 'Test update sent via WebSocket!' });
});

export default router;
