import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();

export const initProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (err) {
    console.error("Kafka Producer connection error:", err);
  }
};


const createMessage = (event, data) => ({
  event,
  data,
  timestamp: new Date().toISOString(),
});


export const emitOrderPlaced = async (order) => {
  const message = createMessage('order_placed', order);
  
  await producer.send({
    topic: 'order.placed', 
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Kafka: order_placed event sent');
};

export const emitOrderCancelled = async (order) => {
  const message = createMessage('order_cancelled', {
    orderId: order._id,
    userId: order.userId,
    restaurantId: order.restaurantId,
    status: 'cancelled',
  });

  await producer.send({
    topic: 'order.cancelled', // Consistent topic naming
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Kafka: order_cancelled event sent');
};
