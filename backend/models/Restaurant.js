const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  cuisine: [{
    type: String,
    required: true,
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  deliveryTime: {
    type: String,
    default: '30-40 min',
  },
  deliveryFee: {
    type: Number,
    default: 40,
  },
  minOrder: {
    type: Number,
    default: 100,
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
