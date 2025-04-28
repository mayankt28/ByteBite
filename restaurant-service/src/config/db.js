import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB (Restaurant Service)');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
