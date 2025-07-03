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

export const createRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }

    const restaurant = new Restaurant({ name, address });
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Create restaurant error:', err);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { name, address },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error('Update restaurant error:', err);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error('Delete restaurant error:', err);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({ _id: id, isDeleted: false });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error('Get restaurant error:', err);
    res.status(500).json({ error: 'Failed to get restaurant' });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find(
      { isDeleted: false },
      { menu: 0 } 
    );

    res.json(restaurants);
  } catch (err) {
    console.error('Get all restaurants error:', err);
    res.status(500).json({ error: 'Failed to get restaurants' });
  }
};

