import mongoose from 'mongoose';

const restaurantPerformanceSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true, unique: true },
  totalRevenue: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  cancelledOrders: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
});

export default mongoose.model('RestaurantPerformance', restaurantPerformanceSchema);
