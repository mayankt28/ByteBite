import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import reviewRoutes from './routes/reviews.js';
import { startConsumer } from './kafka/consumer.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Review Service running on port ${PORT}`);
    startConsumer(); // Start Kafka consumer when server starts
});
