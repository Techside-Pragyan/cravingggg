const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true,
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default: 40,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    zipCode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'placed',
  },
  estimatedDelivery: {
    type: String,
    default: '30-40 min',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
