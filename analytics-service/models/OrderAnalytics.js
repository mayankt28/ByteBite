import mongoose from 'mongoose';

const orderAnalyticsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  restaurantId: { type: String, default: null }, // null = platform-wide
  totalOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  cancelledOrders: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  refundedAmount: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 },
  deliveryAreas: {
    type: Map,
    of: Number, // area name => count of orders
    default: {}
  }
});

orderAnalyticsSchema.index({ date: 1, restaurantId: 1 }, { unique: true });

export default mongoose.model('OrderAnalytics', orderAnalyticsSchema);
