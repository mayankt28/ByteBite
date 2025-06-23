import express from 'express';
import { createReview, getMenuItemsReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/menu-items', getMenuItemsReviews);

export default router;
