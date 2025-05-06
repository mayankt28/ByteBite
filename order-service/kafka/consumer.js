import { Kafka } from 'kafkajs';
import { Order } from '../models/Order.js';
import { sendOrderUpdateToUser } from '../websocket/socketServer.js'

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'order-group' });


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
  await consumer.subscribe({ topic: 'order.status_updated', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { orderId, status } = event.data;

      console.log(`Received status update for order ${orderId}: ${status}`);

      // Update order in DB
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          console.warn(` Order with ID ${orderId} not found`);
          return;
        }

        order.status = status;
        await order.save();
        sendOrderUpdateToUser(order.userId, status);
      } catch (err) {
        console.error(`Failed to update order ${orderId}:`, err);
      }
    },
  });
};
