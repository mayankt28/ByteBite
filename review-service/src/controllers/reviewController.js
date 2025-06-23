import Review from '../models/Review.js';
import MenuItemReview from '../models/MenuItemReview.js';

// Submit a review
export const createReview = async (req, res) => {
    const { menuItemId, rating, comment } = req.body;

    try {
        const review = await Review.create({
            menuItemId,
            userId: req.user.id,
            rating,
            comment
        });

        let summary = await MenuItemReview.findOne({ menuItemId });
        if (summary) {
            const newTotal = summary.totalReviews + 1;
            const newAverage = ((summary.averageRating * summary.totalReviews) + rating) / newTotal;
            const comments = summary.recentComments.slice(0, 2);
            comments.unshift(comment);

            summary.averageRating = newAverage;
            summary.totalReviews = newTotal;
            summary.recentComments = comments;
            await summary.save();
        }

        res.status(201).json({ message: 'Review added', review });
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error });
    }
};

// Batch fetch reviews for multiple menu items
export const getMenuItemsReviews = async (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : [];

    try {
        const summaries = await MenuItemReview.find({ menuItemId: { $in: ids } });
        const reviewMap = {};

        summaries.forEach(item => {
            reviewMap[item.menuItemId] = {
                averageRating: item.averageRating,
                totalReviews: item.totalReviews,
                recentComments: item.recentComments
            };
        });

        res.json({ reviews: reviewMap });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};
