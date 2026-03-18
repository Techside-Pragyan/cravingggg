const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate total before saving
cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
