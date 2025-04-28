import express from 'express';
import { getRestaurantDetails } from '../controllers/restaurantController.js';
import express from 'express';
import multer from 'multer';
import { uploadItemImage } from '../controllers/restaurantController.js';

const router = express.Router();
const upload = multer();

router.post('/upload-item-image', upload.single('image'), uploadItemImage);
router.get('/:restaurantId', getRestaurantDetails);

export default router;