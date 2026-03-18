const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Restaurant = require('../models/Restaurant');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', protect, async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod = 'cod' } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.foodItem');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const restaurant = await Restaurant.findById(cart.restaurant);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orderItems = cart.items.map(item => ({
      foodItem: item.foodItem._id,
      name: item.foodItem.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = cart.totalAmount;
    const deliveryFee = restaurant.deliveryFee || 40;
    const grandTotal = totalAmount + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      restaurant: cart.restaurant,
      items: orderItems,
      totalAmount,
      deliveryFee,
      grandTotal,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'placed',
      estimatedDelivery: restaurant.deliveryTime || '30-40 min',
    });

    // Clear the cart
    await Cart.findOneAndDelete({ user: req.user._id });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant', 'name image')
      .populate('user', 'name email');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/my
// @desc    Get user's order history
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image address')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure user can only see their own orders (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders (Admin)
// @desc    Get all orders
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status (Admin)
// @desc    Update order status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
