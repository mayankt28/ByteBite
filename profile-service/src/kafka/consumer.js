import { Kafka } from 'kafkajs';
import Profile from '../models/profile.js';

const kafka = new Kafka({
  clientId: 'profile-service',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'profile-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user_created', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log('Received event from Kafka:', data);

      try {
        const existing = await Profile.findOne({ userId: data.userId });
        if (!existing) {
          await Profile.create({
            userId: data.userId,
            name: data.name,
            email: data.email,
          });
          console.log("Profile created for user:", data.userId);
        }
      } catch (err) {
        console.error("Error creating profile from Kafka event:", err.message);
      }
    },
  });
};

export default startConsumer;
