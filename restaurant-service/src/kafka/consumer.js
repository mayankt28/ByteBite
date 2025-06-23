import { Kafka } from 'kafkajs';
import { Order } from '../models/Order.js';

const kafka = new Kafka({
  clientId: 'restaurant-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'restaurant-group' });

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await consumer.connect();
      console.log('✅ Kafka consumer connected');
      return;
    } catch (err) {
      console.error(`❌ Kafka connection failed (attempt ${i + 1}):`, err.message);
      if (i < retries - 1) {
        console.log(`🔁 Retrying in ${delay / 1000}s...`);
        await wait(delay);
      } else {
        throw new Error('Kafka connection failed after maximum retries');
      }
    }
  }
};


export const initConsumer = async () => {
  await connectWithRetry();
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
    const { orderId, userId, restaurantId, items } = data;

    const newOrder = new Order({
      orderId,
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
