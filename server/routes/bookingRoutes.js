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
            transactionId,
            paymentStatus: 'paid' // Assuming paid for now since we have a payment mock
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

// Get single booking by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('workspace');
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Allow user or admin or workspace owner to view
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            // Ideally check workspace owner too but for payment page user is enough
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(booking);
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

// Update Booking Status (Cancel/Confirm/Reject)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'confirmed', 'cancelled', 'rejected'
        const booking = await Booking.findById(req.params.id).populate('workspace');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Logic to allow Update
        // 1. Admin can always update
        // 2. User can CANCEL their own booking
        // 3. Workspace Owner can CONFIRM or REJECT

        let isAuthorized = false;

        if (req.user.role === 'admin') {
            isAuthorized = true;
        } else if (req.user.id === booking.user.toString()) {
            if (status === 'cancelled') {
                isAuthorized = true;
            } else {
                return res.status(403).json({ message: 'Users can only cancel bookings' });
            }
        } else if (req.user.id === booking.workspace.owner.toString()) {
            if (['confirmed', 'rejected'].includes(status)) {
                isAuthorized = true;
            } else {
                return res.status(403).json({ message: 'Owners can only confirm or reject bookings' });
            }
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
