import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

export const initProducer = async (retries = 5, delay = 5000) => {
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


const createMessage = (event, data) => ({
  event,
  data,
  timestamp: new Date().toISOString(),
});


export const emitOrderPlaced = async (order) => {
  const message = createMessage('order_placed', {
    orderId: order._id,
    userId: order.userId,
    restaurantId: order.restaurantId,
    items: order.items,
    totalAmount: order.totalAmount,
    discount: order.discount,
    taxAmount: order.taxAmount,
    paymentMethod: order.paymentMethod,
    deliveryTime: order.deliveryTime,
    priority: order.priority,
    source: order.source,
    deliveryMethod: order.deliveryMethod,
    itemsSubtotal: order.itemsSubtotal,
    referralCode: order.referralCode,
    deliveryArea: order.deliveryArea,
    createdAt: order.createdAt,
  });

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
    cancellationReason: order.cancellationReason,
    refundedAmount: order.refundedAmount,
  });

  await producer.send({
    topic: 'order.cancelled',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('Kafka: order_cancelled event sent');
};

