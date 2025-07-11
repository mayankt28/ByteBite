import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected for Review Service');
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1);
    }
};

export default connectDB;
