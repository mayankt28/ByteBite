import { Restaurant } from '../models/Restaurant.js';
import { minioClient, BUCKET_NAME } from '../utils/minioClient.js';
import { v4 as uuidv4 } from 'uuid';


export const uploadItemImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const originalName = req.file.originalname;
    const extension = originalName.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    await minioClient.putObject(BUCKET_NAME, filename, req.file.buffer);

    const publicUrl = `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}/${BUCKET_NAME}/${filename}`;

    res.status(201).json({ url: publicUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};



export const getRestaurantDetails = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId).lean();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error('Error fetching restaurant:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
