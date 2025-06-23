import { Restaurant } from '../models/Restaurant.js';

export const addMenuItem = async (req, res) => {
  try {
    const { restaurantId: restaurantId } = req.params;
    const { name, price } = req.body;
    let imageUrl = req.file ? req.file.location : null;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required for menu item' });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ error: 'Price must be a valid number' });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const newItem = {         
      name,
      price: numericPrice,      
      image: imageUrl,
    };

    restaurant.menu.push(newItem);
    await restaurant.save();

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Add menu item error:', err);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

export const updateMenuItem = async (req, res) => {
    try {
      const { restaurantId, itemId } = req.params;
      const { name, price } = req.body;
      let imageUrl = req.file ? req.file.location : undefined;
  
      const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
  
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      const menuItem = restaurant.menu.id(itemId);
  
      if (!menuItem || menuItem.isDeleted) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
  
      if (name) menuItem.name = name;
      if (price) menuItem.price = price;
      if (imageUrl !== undefined) menuItem.imageUrl = imageUrl;
      console.log(imageUrl)
  
      await restaurant.save();
  
      res.json(menuItem);
    } catch (err) {
      console.error('Update menu item error:', err);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  };

export const deleteMenuItem = async (req, res) => {
    try {
      const { restaurantId, itemId } = req.params;
  
      const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
  
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      const menuItem = restaurant.menu.id(itemId);
  
      if (!menuItem || menuItem.isDeleted) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
  
      menuItem.isDeleted = true;
      await restaurant.save();
  
      res.json({ message: 'Menu item deleted successfully' });
    } catch (err) {
      console.error('Delete menu item error:', err);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  };

export const getMenuItems = async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false });
  
      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
      }
  
      const activeItems = restaurant.menu.filter(item => !item.isDeleted);
  
      res.json(activeItems);
    } catch (err) {
      console.error('Get menu items error:', err);
      res.status(500).json({ error: 'Failed to get menu items' });
    }
  };  