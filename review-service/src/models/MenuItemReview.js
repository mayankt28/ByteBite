import mongoose from 'mongoose';

const menuItemReviewSchema = new mongoose.Schema({
    menuItemId: { type: String, required: true, unique: true },
    restaurantId: { type: String, required: true },
    averageRating: { type: Number, default: null },
    totalReviews: { type: Number, default: 0 },
    recentComments: { type: [String], default: [] }
});

const MenuItemReview = mongoose.model('MenuItemReview', menuItemReviewSchema);
export default MenuItemReview;
