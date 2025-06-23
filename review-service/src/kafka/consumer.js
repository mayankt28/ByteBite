import { Kafka } from 'kafkajs';
import MenuItemReview from '../models/MenuItemReview.js';

const kafka = new Kafka({
    clientId: 'review-service',
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'review-service-group' });

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

export const startConsumer = async () => {
    await connectWithRetry();
    await consumer.subscribe({ topic: 'menu_item_created', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value.toString());

            const { data } = payload;

            if (!data?.menuItemId || !data?.restaurantId) {
                console.warn('⚠️ Missing menuItemId or restaurantId in Kafka message:', payload);
                return;
            }

            try {
                await MenuItemReview.create({
                    menuItemId: data.menuItemId,
                    restaurantId: data.restaurantId
                });

                console.log(`✅ Initialized review summary for menu item: ${data.menuItemId}`);
            } catch (error) {
                console.error('Error creating menu item review placeholder', error);
            }
        }
    });
};

