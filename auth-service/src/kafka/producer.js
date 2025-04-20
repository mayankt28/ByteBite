import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (err) {
    console.error("Kafka Producer connection error:", err);
  }
};

const publishUserCreated = async (user) => {
  try {
    await producer.send({
      topic: 'user_created',
      messages: [
        {
          key: user._id.toString(),
          value: JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
          }),
        },
      ],
    });
    console.log("Sent user_created event to Kafka");
  } catch (err) {
    console.error("Failed to send user_created event:", err);
  }
};

export { connectProducer, publishUserCreated };
