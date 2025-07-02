import express from 'express';
import {
  getUserSummary,
  getUserGrowth,
  getOrderSummary,
  getOrderTimeseries,
  getReferralStats,
  getDeliveryAreaStats,
  getReviewSummary,
  getRatingDistribution,
  getTopRatedItems,
  getTopRestaurants,
  getLowRatedRestaurants
} from '../controllers/analyticsController.js';

import { checkAnalyticsAccess } from '../middleware/checkAnalyticsAccess.js';

const router = express.Router();

// User Analytics
router.get('/users/summary', checkAnalyticsAccess, getUserSummary);
router.get('/users/growth', checkAnalyticsAccess, getUserGrowth);

// Orders
router.get('/orders/summary', checkAnalyticsAccess, getOrderSummary);
router.get('/orders/:restaurantId/summary', checkAnalyticsAccess, getOrderSummary);

router.get('/orders/timeseries', checkAnalyticsAccess, getOrderTimeseries);
router.get('/orders/:restaurantId/timeseries', checkAnalyticsAccess, getOrderTimeseries);

router.get('/orders/referrals', checkAnalyticsAccess, getReferralStats);
router.get('/orders/:restaurantId/referrals', checkAnalyticsAccess, getReferralStats);

router.get('/orders/delivery-areas', checkAnalyticsAccess, getDeliveryAreaStats);
router.get('/orders/:restaurantId/delivery-areas', checkAnalyticsAccess, getDeliveryAreaStats);

// Reviews
router.get('/reviews/summary', checkAnalyticsAccess, getReviewSummary);
router.get('/reviews/:restaurantId/summary', checkAnalyticsAccess, getReviewSummary);

router.get('/reviews/:restaurantId/rating-distribution', checkAnalyticsAccess, getRatingDistribution);

router.get('/reviews/top-rated-items', checkAnalyticsAccess, getTopRatedItems);

// Restaurant Performance
router.get('/restaurants/top', checkAnalyticsAccess, getTopRestaurants);
router.get('/restaurants/low-rated', checkAnalyticsAccess, getLowRatedRestaurants);

export default router;
