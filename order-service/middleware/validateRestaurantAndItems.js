import axios from 'axios';

export const validateRestaurantAndItems = async (req, res, next) => {
  try {
    const { restaurantId, items } = req.body;

    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Restaurant ID and items are required' });
    }

    // Fetch restaurant details from Restaurant Management Service
    const { data: restaurant } = await axios.get(`>>____Restaurant Serive API ENDPOINT HERE____<<`);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuItemIds = restaurant.menu.map(item => item._id);

    for (const item of items) {
      if (!menuItemIds.includes(item.itemId)) {
        return res.status(400).json({ error: `Invalid itemId: ${item.itemId}` });
      }
    }

    next(); 
  } catch (err) {
    console.error('Validation error:', err.message);

    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.status(500).json({ error: 'Error validating restaurant and items' });
  }
};
