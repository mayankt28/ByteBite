import { Kafka } from 'kafkajs';
import { Order } from '../models/Order.js';

const kafka = new Kafka({
  clientId: 'restaurant-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'restaurant-group' });

export const initConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.placed', fromBeginning: false });
  await consumer.subscribe({ topic: 'order.cancelled', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { event: eventType, data } = event;

      console.log(`Received Kafka event: ${eventType}`);

      if (eventType === 'order_placed') {
        await handleOrderPlaced(data);
      } else if (eventType === 'order_cancelled') {
        await handleOrderCancelled(data);
      }
    }
  });
};

const handleOrderPlaced = async (data) => {
  try {
    const { _id, userId, restaurantId, items } = data;

    const newOrder = new Order({
      orderId: _id,
      userId,
      restaurantId,
      items,
    });

    await newOrder.save();
    console.log(`Order saved in restaurant-service: ${_id}`);
  } catch (err) {
    console.error('Error handling order placed:', err);
  }
};

const handleOrderCancelled = async (data) => {
  try {
    const { orderId } = data;

    const order = await Order.findOne({ orderId });
    if (!order) {
      console.warn(`Order not found for cancellation: ${orderId}`);
      return;
    }

    order.status = 'cancelled';
    await order.save();
    console.log(`Order marked as cancelled: ${orderId}`);
  } catch (err) {
    console.error('Error handling order cancelled:', err);
  }
};
