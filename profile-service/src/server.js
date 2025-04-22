import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

import startConsumer from './kafka/consumer.js';
import profileRoutes from './routes/profile.js';

const app = express();
app.use(express.json());

app.use('/api/profile', profileRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await startConsumer();
    console.log("Kafka consumer started");

    app.listen(process.env.PORT, () =>
      console.log(`Profile service running on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.error("Startup error:", err);
  }
};

start();
