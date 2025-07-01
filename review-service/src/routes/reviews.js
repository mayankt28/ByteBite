import express from 'express';
import { createReview, getMenuItemsReviews,getMenuItemReviews, editReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/menu-items', getMenuItemsReviews);
router.put('/:reviewId', protect, editReview);
router.delete('/:reviewId', protect, deleteReview);
router.get('/menu-item/:menuItemId', getMenuItemReviews);

export default router;
