import { Order } from '../models/Order.js';
import { emitOrderStatusUpdated } from '../kafka/producer.js';

// Fetch all pending orders
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['placed', 'preparing'] }
    });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching pending orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['preparing', 'ready', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status update' });
  }

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Emit Kafka event to notify order-service
    await emitOrderStatusUpdated(order);

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
