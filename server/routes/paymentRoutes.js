const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get User Payments
router.get('/', auth, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate({
                path: 'booking',
                populate: { path: 'workspace', select: 'name location' }
            })
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        console.error('Fetch Payments Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create Payment Order
router.post('/create-order', auth, async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Razorpay expects amount in paise (1 INR = 100 paise)
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${bookingId.substring(0, 10)}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Failed to create Razorpay order' });
        }

        const transactionId = order.id;

        // Check if payment record exists or create new
        let payment = await Payment.findOne({ transactionId });
        if (!payment) {
            payment = new Payment({
                booking: bookingId,
                user: req.user.id,
                amount, // store in INR
                paymentMethod: paymentMethod || 'razorpay',
                transactionId,
                status: 'pending'
            });
            await payment.save();
        }

        res.json({
            success: true,
            orderId: order.id,
            amount: amount,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('Create Order Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Verify Payment
router.post('/verify', auth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify signature
        const crypto = require('crypto');
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        const payment = await Payment.findOne({ transactionId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        payment.status = 'completed';
        payment.paymentMethod = 'razorpay';
        await payment.save();

        // Update Booking Status
        const booking = await Booking.findById(payment.booking).populate('workspace').populate('user');
        if (booking) {
            booking.status = 'confirmed';
            booking.paymentStatus = 'paid';
            booking.transactionId = razorpay_payment_id;
            await booking.save();

            // Send confirmation email
            try {
                await sendOrderConfirmationEmail(booking.user.email, booking);
                console.log(`✅ Confirmation email sent to ${booking.user.email}`);
            } catch (emailError) {
                console.error('❌ Failed to send confirmation email:', emailError);
                // Don't fail the payment if email fails
            }
        }

        res.json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
        console.error('Verify Payment Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
