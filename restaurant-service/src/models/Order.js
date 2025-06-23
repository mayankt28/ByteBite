import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true, index: true }, // Add index
  items: [
    {
      itemId: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['placed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'placed',
  },
}, { timestamps: true }); 

export const Order = mongoose.model('Order', orderSchema);
