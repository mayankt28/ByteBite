import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './config/db.js'
import analyticsRoutes from './routes/analyticsRoutes.js';
import { startConsumer } from './kafka/consumer.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analytics', analyticsRoutes);


// Start Server
const PORT = process.env.PORT || 5005;

const start = async () => {
  await connectDB();
  await startConsumer();

  app.listen(PORT, () => {
    console.log(`🚀 Analytics Service running on port ${PORT}`);
  });
};

start();