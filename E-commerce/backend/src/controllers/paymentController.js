import Order from "../models/Order.models.js";
import razorpay from '../config/razorpay.js';
import Product from '../models/Product.models.js'

// Create razorpay order

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalAmount, currency } = req.body;
    
    const calculatedTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalTotal = totalAmount || calculatedTotal + (taxPrice || 0) + (shippingPrice || 0);
    
    const options = {
      amount: Math.round(finalTotal * 100), // Amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save order to database
    const order = new Order({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      itemsPrice: itemsPrice || calculatedTotal,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      totalPrice: finalTotal,
      paymentResult: {
        razorpayOrderId: razorpayOrder.id,
        status: 'created'
      }
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json({
      success: true,
      order: createdOrder,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID // Send key ID to frontend
      }
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    next(error);
  }
};

// Verify payment signature
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    console.log('Payment verification data:', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
    
    // Create expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }
    
    // Find and update order
    const order = await Order.findOne({ 
      'paymentResult.razorpayOrderId': razorpay_order_id 
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }
    
    // Update order payment status
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'completed',
      update_time: new Date()
    };
    
    const updatedOrder = await order.save();
    
    // Update product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product, 
        { $inc: { stock: -item.quantity } }
      );
    }
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder
    });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    next(error);
  }
};

// Get payment order details
export const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ 
      'paymentResult.razorpayOrderId': orderId 
    }).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Get order details error:', error);
    next(error);
  }
};

// Get user orders
// Get user orders with strictPopulate disabled for this query
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'orderItems.product',
        select: 'name images',
        options: { strictPopulate: false }
      });
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    next(error);
  }
};

// get order by ID
 // Get order by ID or Razorpay order ID
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let order;
    
    // Check if the ID is a valid MongoDB ObjectId (24-character hex string)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId
      order = await Order.findById(id)
        .populate('user', 'name email')
        .populate('orderItems.product', 'name images');
    } else if (id.startsWith('order_')) {
      // It's a Razorpay order ID - search by paymentResult.id or razorpayOrderId
      order = await Order.findOne({ 
        $or: [
          { 'paymentResult.id': id },
          { 'paymentResult.razorpayOrderId': id }
        ]
      })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');
    } else {
      return res.status(400).json({ 
        message: 'Invalid order ID format. Must be MongoDB ObjectId or Razorpay order ID' 
      });
    }
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order by ID error:', error);
    next(error);
  }
};