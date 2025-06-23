import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'restaurant-service',
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await producer.connect();
      console.log('✅ Kafka producer connected');
      return;
    } catch (err) {
      console.error(`❌ Kafka connection failed (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) throw err;
      console.log(`⏳ Retrying Kafka connection in ${delay / 1000}s...`);
      await wait(delay);
    }
  }
};

export const initProducer = async () => {
  await connectWithRetry();
};

export const emitOrderStatusUpdated = async (order) => {
  const message = {
    event: 'order_status_updated',
    data: {
      orderId: order.orderId,
      status: order.status,
    },
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic: 'order.status_updated',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Kafka: order_status_updated event sent');
};
