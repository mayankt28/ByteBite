import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'review-service',
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectProducer = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await producer.connect();
      console.log('✅ Kafka producer connected');
      return;
    } catch (err) {
      console.error(`❌ Kafka connection failed (attempt ${i + 1}):`, err.message);
      if (i === retries - 1) throw err;
      await wait(delay);
    }
  }
};

export const emitReviewCreated = async (review, restaurantId) => {
  const message = {
    event: 'review.created',
    data: {
      reviewId: review._id,
      menuItemId: review.menuItemId,
      restaurantId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    },
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic: 'review.created',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('✅ Sent review.created event');
};

export const emitReviewUpdated = async (review, restaurantId) => {
  const message = {
    event: 'review.updated',
    data: {
      reviewId: review._id,
      menuItemId: review.menuItemId,
      restaurantId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      updatedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic: 'review.updated',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('✅ Sent review.updated event');
};

export const emitReviewDeleted = async (review, restaurantId) => {
  const message = {
    event: 'review.deleted',
    data: {
      reviewId: review._id,
      menuItemId: review.menuItemId,
      restaurantId,
      userId: review.userId,
    },
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic: 'review.deleted',
    messages: [{ value: JSON.stringify(message) }],
  });

  console.log('✅ Sent review.deleted event');
};
