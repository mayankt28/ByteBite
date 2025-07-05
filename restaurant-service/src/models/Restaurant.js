import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  image: String, 
  isDeleted: { type: Boolean, default: false },
}, { _id: true });

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String, 
  address: String,
  categories: [String], 
  menu: [menuItemSchema],
  isDeleted: { type: Boolean, default: false },
}, 
{ timestamps: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
