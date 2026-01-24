const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Workspace = require('../models/Workspace');
const { auth } = require('../middleware/auth');

// Create a booking
router.post('/', auth, async (req, res) => {
    try {
        const { workspaceId, date, startTime, duration, totalPrice } = req.body;

        const platformFee = totalPrice * 0.10; // 10% commission
        const ownerAmount = totalPrice - platformFee;
        const transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

        const booking = new Booking({
            workspace: workspaceId,
            user: req.user.id,
            date,
            startTime,
            duration,
            totalPrice,
            platformFee,
            ownerAmount,
            transactionId
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's bookings
router.get('/my', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('workspace')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get owner's incoming bookings
router.get('/owner', auth, async (req, res) => {
    try {
        // Find workspaces owned by this user
        const workspaces = await Workspace.find({ owner: req.user.id });
        const workspaceIds = workspaces.map(w => w._id);

        const bookings = await Booking.find({ workspace: { $in: workspaceIds } })
            .populate('workspace')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
