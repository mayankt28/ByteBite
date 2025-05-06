import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['customer', 'employee', 'manager', 'admin'],
    default: 'customer'
  },

  restaurantId: {
    type: String, 
    required: function () {
      return this.role === 'employee' || this.role === 'manager';
    }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
