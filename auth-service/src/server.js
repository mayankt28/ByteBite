import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { connectProducer } from './kafka/producer.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await connectProducer();
  app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
  });
});
