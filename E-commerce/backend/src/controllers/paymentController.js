import Order from "../models/Order.models.js";
import razorpay from '../config/razorpay.js';
import Product from '../models/Product.models.js'

// Create razorpay order
export const createOrder = async (req, res, next) => {
    try {
        const {items, shippingAddress, itemsPrice, taxPrice, shippingPrice, totalAmount, currency} = req.body;

        // calculate total if not provided
        const calculatedTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const finalTotal = totalAmount || calculatedTotal + taxPrice + shippingPrice;

        const optinos = {
            amount: Math.round(finalTotal * 100), // amount in the smallest currency un it(paise)
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(optinos);

        // save order to database
        const order = new Order({
            user: req.user._id,
            orderItems: items,
            shippingAddress,
            itemsPrice: itemsPrice || calculatedTotal,
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice ||0,
            totalPrice: finalTotal,
            paymentResult: {
                id: razorpayOrder.id,
                status: 'created',
                update_time: new Date(),
                email_address: req.user.email
            }
        });

        const createdOrder = await order.save();

        res.status(201).json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount : razorpayOrder.amount,
            orderId: createOrder._id
        });
    } catch (error) {
        next(error);
    }
}

// Verify payment
export const verifyPayment = async (req, res, next) => {
    try {
        const {order_id, payment_id, signature} = req.body;

        // In a real application you should verify the signature
        // For now , we'll assume payment is successfull

        // find the order
        const order = await Order.findById(order_id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: payment_id,
                status: 'completed',
                update_time: new Date(),
                email_address: req.user.email,
                signature  // Store the signature for future verification
            };

            const updateOrder = await order.save();

            // update product stock
            for(const item of order.orderItems){
                await Product.findByIdAndUpdate(
                    item.product,
                    {$inc: {stock: -item.quantity}}
                );
            }

            res.json(updateOrder);
        } else {
            res.status(404).json({message: 'Order not found'});
        }
    } catch (error) {
        next(error);
    }
};

// Get user orders
export const getUserOrders = async(req, res, next) => {
    try {
        const orders = await Order.find({user: req.user._id}).populate('user', 'name email').populate('OrderItems.product', 'name images');
        res.json(orders);
    } catch (error) {
        next(error)
    }
}

// get order by ID
 export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name images');

        if (order) {
            res.json(order);
        } else{
            res.status(404).json({message: 'Order not found'});
        }
    } catch (error) {
        next(error);
    }
 }