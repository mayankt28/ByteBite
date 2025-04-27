import { Kafka } from 'kafkajs';
import { Order } from '../models/Order.js';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'order-group' });

export const initConsumer = async () => {
  await consumer.connect();
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

        // TODO: Broadcast to client via WebSocket (next step)
      } catch (err) {
        console.error(`Failed to update order ${orderId}:`, err);
      }
    },
  });
};
