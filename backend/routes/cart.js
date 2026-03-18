const express = require('express');
const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.foodItem')
      .populate('restaurant', 'name image deliveryTime deliveryFee');

    if (!cart) {
      cart = { items: [], totalAmount: 0 };
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { foodItemId, quantity = 1 } = req.body;

    const foodItem = await FoodItem.findById(foodItemId);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        restaurant: foodItem.restaurant,
        items: [],
      });
    }

    // Check if adding from different restaurant
    if (cart.restaurant && cart.items.length > 0 && cart.restaurant.toString() !== foodItem.restaurant.toString()) {
      return res.status(400).json({
        message: 'You can only order from one restaurant at a time. Clear your cart first.',
        differentRestaurant: true,
      });
    }

    cart.restaurant = foodItem.restaurant;

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.foodItem.toString() === foodItemId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        foodItem: foodItemId,
        quantity,
        price: foodItem.price,
      });
    }

    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name image deliveryTime deliveryFee');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
router.put('/update', protect, async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.foodItem.toString() === foodItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name image deliveryTime deliveryFee');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
