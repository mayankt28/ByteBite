import express from 'express';
import { upload } from '../utils/upload.js'; 
import { checkAdminOrRestaurantEmployee } from '../middlewares/authMiddleware.js';
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurant,
  getAllRestaurants,
  getRestaurantDetails,
} from '../controllers/restaurantController.js';

import {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItems,
  } from '../controllers/menuController.js';

const router = express.Router();

router.get('/:restaurantId', getRestaurantDetails);

router.post('/', checkAdminOrRestaurantEmployee, createRestaurant);
router.put('/:id', checkAdminOrRestaurantEmployee, updateRestaurant);
router.delete('/:id', checkAdminOrRestaurantEmployee, deleteRestaurant);
router.get('/:id', getRestaurant);
router.get('/', getAllRestaurants);


router.post('/:restaurantId/menu', checkAdminOrRestaurantEmployee, upload.single('image'), addMenuItem);
router.put('/:restaurantId/menu/:itemId', checkAdminOrRestaurantEmployee, upload.single('image'), updateMenuItem);
router.delete('/:restaurantId/menu/:itemId', checkAdminOrRestaurantEmployee, deleteMenuItem);
router.get('/:restaurantId/menu', getMenuItems);

export default router;