const express = require('express');
const Restaurant = require('../models/Restaurant');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants with filtering
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, isVeg, featured, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',') };
    }

    if (isVeg === 'true') {
      query.isVeg = true;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'deliveryTime') sortOption = { deliveryTime: 1 };
    else if (sort === 'name') sortOption = { name: 1 };
    else sortOption = { createdAt: -1 };

    const restaurants = await Restaurant.find(query).sort(sortOption);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/restaurants/featured
// @desc    Get featured restaurants
router.get('/featured', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ featured: true }).limit(8);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/restaurants (Admin)
// @desc    Create a restaurant
router.post('/', protect, admin, async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/restaurants/:id (Admin)
// @desc    Update a restaurant
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/restaurants/:id (Admin)
// @desc    Delete a restaurant
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (restaurant) {
      res.json({ message: 'Restaurant deleted' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
