import mongoose from 'mongoose';

const reviewAnalyticsSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true, unique: true },
  totalReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  }
});

export default mongoose.model('ReviewAnalytics', reviewAnalyticsSchema);
