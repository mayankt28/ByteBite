import express from 'express';
import { getRestaurantDetails } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/:restaurantId', getRestaurantDetails);

export default router;
