import mongoose from 'mongoose';

const menuItemRatingsSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true, unique: true },
  restaurantId: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

export default mongoose.model('MenuItemRatings', menuItemRatingsSchema);
