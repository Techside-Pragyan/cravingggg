const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  },
  category: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg', 'fast-food', 'desserts', 'beverages', 'starters', 'main-course', 'biryani', 'pizza', 'burger', 'chinese', 'south-indian'],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5,
  },
  isBestseller: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
