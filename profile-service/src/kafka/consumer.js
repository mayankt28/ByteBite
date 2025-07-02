import { Kafka } from 'kafkajs';
import Profile from '../models/profile.js';

const kafka = new Kafka({
  clientId: 'profile-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'profile-group' });


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

const startConsumer = async () => {
  await connectWithRetry();
  await consumer.subscribe({ topic: 'user_created', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const eventMessage = JSON.parse(message.value.toString());
        const { event, data } = eventMessage;

        console.log('Received event from Kafka:', eventMessage);

        if (event !== 'user_created' || !data) {
          console.warn('⚠️ Unknown or improperly formatted event received');
          return;
        }

        const existing = await Profile.findOne({ userId: data.userId });
        if (!existing) {
          await Profile.create({
            userId: data.userId,
            name: data.name,
            email: data.email,
          });
          console.log("✅ Profile created for user:", data.userId);
        }

      } catch (err) {
        console.error("❌ Error processing Kafka message:", err.message);
      }
    },
  });
};


export default startConsumer;
