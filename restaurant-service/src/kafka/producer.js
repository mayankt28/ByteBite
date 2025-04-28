import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'restaurant-service',
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();

export const initProducer = async () => {
  await producer.connect();
  console.log('✅ Kafka producer connected (restaurant-service)');
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
