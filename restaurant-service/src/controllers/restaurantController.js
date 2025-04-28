import { Restaurant } from '../models/Restaurant.js';


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
