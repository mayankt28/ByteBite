import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({ 
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
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
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'cash', 'other'], required: true },
  deliveryTime: { type: Date },
  priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  customerRating: { type: Number, min: 1, max: 5 },
  source: { type: String, enum: ['mobile', 'web', 'in-store'], required: true },
  completedAt: { type: Date },
  deliveryMethod: { type: String, enum: ['delivery', 'pickup'], required: true },
  itemsSubtotal: { type: Number, required: true },
  refundedAmount: { type: Number, default: 0 },
  cancellationReason: { type: String, enum: ['customer_request', 'restaurant_issue', 'delivery_issue', 'other'] },
  loyaltyPoints: { type: Number, default: 0 },
  deliveryArea: { type: String },
  referralCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
