import Review from '../models/Review.js';
import MenuItemReview from '../models/MenuItemReview.js';
import { emitReviewUpdated, emitReviewDeleted, emitReviewCreated } from '../kafka/producer.js';

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
        await emitReviewCreated(review, summary.restaurantId);


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

// Edit an existing review with summary update
export const editReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized to edit this review' });

    const oldRating = review.rating;
    const oldComment = review.comment;

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    const summary = await MenuItemReview.findOne({ menuItemId: review.menuItemId });
    if (summary && rating) {
      const newAverage = ((summary.averageRating * summary.totalReviews) - oldRating + rating) / summary.totalReviews;
      summary.averageRating = newAverage;
    }
    if (summary && comment && oldComment) {
      const comments = summary.recentComments.filter(c => c !== oldComment);
      comments.unshift(comment);
      summary.recentComments = comments.slice(0, 3);
    }
    if (summary) await summary.save();
    await emitReviewUpdated(review, summary.restaurantId);

    res.json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
};

// Delete an existing review with summary update
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this review' });

    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) return res.status(500).json({ message: 'Failed to delete review' });

    const summary = await MenuItemReview.findOne({ menuItemId: review.menuItemId });

    if (summary) {
      const newTotal = summary.totalReviews - 1;
      if (newTotal <= 0) {
        summary.averageRating = null;
        summary.totalReviews = 0;
        summary.recentComments = [];
      } else {
        const newAverage = ((summary.averageRating * summary.totalReviews) - review.rating) / newTotal;
        summary.averageRating = newAverage;
        summary.totalReviews = newTotal;

       
        const latestReviews = await Review.find({ menuItemId: review.menuItemId })
          .sort({ createdAt: -1 })
          .limit(3);

        summary.recentComments = latestReviews.map(r => r.comment);
      }
      await summary.save();
    }
    await emitReviewDeleted(review, summary.restaurantId);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review', error });
  }
};


// Fetch detailed reviews for a specific menu item
export const getMenuItemReviews = async (req, res) => {
  const { menuItemId } = req.params;

  try {
    const reviews = await Review.find({ menuItemId });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};