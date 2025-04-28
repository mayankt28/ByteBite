import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }, 
  description: { type: String }, 
}, { _id: true });

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  menu: [menuItemSchema],
}, { timestamps: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
