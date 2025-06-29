import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    menuItemId: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
