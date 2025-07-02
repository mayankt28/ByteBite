import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectProducer = async (retries = 5, delay = 5000) => {
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

const publishUserCreated = async (user) => {
  const message = createMessage('user_created', {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  try {
    await producer.send({
      topic: 'user_created',
      messages: [
        {
          key: user._id.toString(),
          value: JSON.stringify(message),
        },
      ],
    });
    console.log("✅ Sent user_created event to Kafka");
  } catch (err) {
    console.error("❌ Failed to send user_created event:", err);
  }
};

export { connectProducer, publishUserCreated };
