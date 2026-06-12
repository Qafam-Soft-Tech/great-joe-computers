import Order from '../models/Order.js';
import Product from '../models/Product.js';
import axios from 'axios';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Validate stock and compute total
    let totalPrice = 0;
    const items = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (product.stockCount < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`,
        });
      }
      items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
      totalPrice += product.price * item.quantity;
    }

    // Create order with pending payment
    const order = await Order.create({
      user: req.user.id,
      orderItems: items,
      shippingAddress,
      totalPrice,
      paymentStatus: 'pending',
    });

    // Reduce stock temporarily (or after payment verification; here we do after order creation)
    // Many systems reduce stock on payment, but for simplicity we reduce now.
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stockCount: -item.quantity } });
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('orderItems.product');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('orderItems.product');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Paystack payment and update order
// @route   POST /api/orders/verify
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Call Paystack API to verify transaction
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const { data } = response.data;
    if (data.status === 'success') {
      order.paymentStatus = 'paid';
      order.paymentReference = reference;
      await order.save();
      res.json({ success: true, message: 'Payment verified', order });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      res.status(400).json({ success: false, message: 'Payment failed or pending' });
    }
  } catch (error) {
    next(error);
  }
};