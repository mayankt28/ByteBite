import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initConsumer } from './kafka/consumer.js';
import { initProducer } from './kafka/producer.js';
import orderRoutes from './routes/orderRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/restaurant/orders', orderRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.get('/api/restaurant/health', (req, res) => {
  res.status(200).json({ status: 'Restaurant service is running' });
});

connectDB();
initProducer();
initConsumer();

export default app;
