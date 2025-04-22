import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true }, 
  street: { type: String, required: true },
  city: String,
  state: String,
  zip: String,
  country: String,
  isDefault: { type: Boolean, default: false } 
}, { _id: true });

const profileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  preferences: [String],
  addresses: [addressSchema],
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
