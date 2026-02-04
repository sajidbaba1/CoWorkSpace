const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

// Create Payment Order (Mock)
router.post('/create-order', auth, async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // In a real app, you would create an order with Razorpay/Stripe here
        // const order = await razorpay.orders.create({ ... });

        const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const payment = new Payment({
            booking: bookingId,
            user: req.user.id,
            amount,
            paymentMethod,
            transactionId,
            status: 'pending' // pending until verified
        });

        await payment.save();

        res.json({
            success: true,
            orderId: transactionId, // Mock Order ID
            amount: amount,
            currency: 'USD',
            key: 'test_key' // Mock Key
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Verify Payment (Mock)
router.post('/verify', auth, async (req, res) => {
    try {
        const { transactionId, status } = req.body; // In real flow, signatures are verified

        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        payment.status = status === 'success' ? 'completed' : 'failed';
        await payment.save();

        // Update Booking Status
        if (payment.status === 'completed') {
            const booking = await Booking.findById(payment.booking);
            if (booking) {
                booking.status = 'confirmed'; // Assuming 'confirmed' is a valid status
                await booking.save();
            }
        }

        res.json({ success: true, message: `Payment ${payment.status}` });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
