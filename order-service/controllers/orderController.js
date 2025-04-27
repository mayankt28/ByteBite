import { Order } from '../models/Order.js';
import { emitOrderPlaced, emitOrderCancelled } from '../kafka/producer.js';

export const placeOrder = async (req, res) => {
  try {
    const { restaurantId, items } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    for (const item of items) {
      if (!item.itemId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return res.status(400).json({ error: 'Invalid item format' });
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      restaurantId,
      items,
    });

    await emitOrderPlaced(order);
    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Could not place order' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Ensure users only access their own orders
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Could not fetch order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Could not fetch orders' });
  }
};

export const cancelOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      if (order.userId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      if (order.status === 'cancelled') {
        return res.status(400).json({ error: 'Order is already cancelled' });
      }
  
      if (order.status !== 'placed') {
        return res.status(400).json({ error: `Cannot cancel order when status is '${order.status}'` });
      }
  
      order.status = 'cancelled';
      await order.save();
  
      // Emit Kafka event
      await emitOrderCancelled(order);
  
      res.json({ message: 'Order cancelled successfully', order });
    } catch (err) {
      console.error('Error cancelling order:', err);
      res.status(500).json({ error: 'Could not cancel order' });
    }
  };
  
  