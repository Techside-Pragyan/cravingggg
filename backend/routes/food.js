const express = require('express');
const FoodItem = require('../models/FoodItem');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/food
// @desc    Get all food items with filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, restaurant, isVeg, bestseller } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = { $in: category.split(',') };
    }

    if (restaurant) {
      query.restaurant = restaurant;
    }

    if (isVeg === 'true') {
      query.isVeg = true;
    }

    if (bestseller === 'true') {
      query.isBestseller = true;
    }

    const foodItems = await FoodItem.find(query).populate('restaurant', 'name image deliveryTime');
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/food/restaurant/:restaurantId
// @desc    Get food items by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurant: req.params.restaurantId });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/food/:id
// @desc    Get single food item
router.get('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate('restaurant');
    if (foodItem) {
      res.json(foodItem);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/food (Admin)
// @desc    Create a food item
router.post('/', protect, admin, async (req, res) => {
  try {
    const foodItem = await FoodItem.create(req.body);
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/food/:id (Admin)
// @desc    Update a food item
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (foodItem) {
      res.json(foodItem);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/food/:id (Admin)
// @desc    Delete a food item
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (foodItem) {
      res.json({ message: 'Food item deleted' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
