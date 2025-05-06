import { Order } from '../models/Order.js';
import { emitOrderPlaced, emitOrderCancelled } from '../kafka/producer.js';

export const placeOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      totalAmount,
      discount = 0,
      taxAmount,
      paymentMethod,
      deliveryTime,
      priority = 'normal',
      source,
      deliveryMethod,
      itemsSubtotal,
      referralCode,
      deliveryArea
    } = req.body;

    // Basic validations
    if (!restaurantId || !Array.isArray(items) || items.length === 0 || !paymentMethod || !source || !deliveryMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
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
      totalAmount,
      discount,
      taxAmount,
      paymentMethod,
      deliveryTime,
      priority,
      source,
      deliveryMethod,
      itemsSubtotal,
      referralCode,
      deliveryArea,
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

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    if (order.status === 'cancelled') return res.status(400).json({ error: 'Order already cancelled' });
    if (order.status !== 'placed') return res.status(400).json({ error: `Cannot cancel order when status is '${order.status}'` });

    order.status = 'cancelled';
    order.cancellationReason = req.body.cancellationReason || 'customer_request';
    await order.save();

    await emitOrderCancelled(order);
    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ error: 'Could not cancel order' });
  }
};