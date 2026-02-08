const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');
const Workspace = require('../models/Workspace');
const User = require('../models/User'); // Import User
const { auth } = require('../middleware/auth');

// Create a booking
router.post('/', auth, async (req, res) => {
    try {
        const { workspaceId, date, startTime, duration, totalPrice } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.aadharCard && !user.profileImage) {
            // Ideally check kycStatus but for now just check if file uploaded
            // But we allow booking request, just won't be approved. 
            // Actually requirement says: "User need... identification for booking ... then admin approval"
            // So we can block here or prompt on UI.
            // Let's block here if no KYC.
            if (user.kycStatus === 'not_submitted') {
                return res.status(400).json({ message: 'KYC not submitted. Please upload Aadhar Card in settings.' });
            }
        }

        // Check availability
        const startDate = new Date(date); // Ensure date Object
        // Should really check times overlapping. For simplicity, we check if same date same workspace has CONFIRMED booking.
        // Or "pending" booking? If pending, it might be rejected.
        // It says "When one user rent something it should show on place currently not available".
        // Let's check for overlapping confirmed bookings.

        // This is a naive availability check. A real one needs exact time comparison.
        // Assuming startTime is "HH:MM".

        const existingBookings = await Booking.find({
            workspace: workspaceId,
            date: startDate,
            status: { $in: ['confirmed', 'approved_for_payment'] }
        });

        // Simple check: if any overlap? 
        // For now, let's just assume if there's a booking on that day, it might be busy. 
        // If it's a "Shared Desk" multiple people can book. If "Private Office", only one.
        // We need Workspace type.
        const workspace = await Workspace.findById(workspaceId);

        // If we want to be strict:
        if (existingBookings.length > 0 && workspace?.type !== 'Shared Desk') {
            return res.status(409).json({ message: 'Workspace is not available for the selected date.' });
        }

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
            transactionId: null, // No transaction yet
            paymentStatus: 'unpaid',
            status: 'pending_approval' // Wait for owner/admin
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
        // Find workspaces owned by this user
        if (!req.user || !req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }
        const workspaces = await Workspace.find({ owner: req.user.id });
        const workspaceIds = workspaces.map(w => w._id);

        const bookings = await Booking.find({ workspace: { $in: workspaceIds } })
            .populate('workspace')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error('Error in /bookings/owner:', err);
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

// Update Booking Status (Cancel/Confirm/Reject/Approve)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'confirmed', 'cancelled', 'rejected', 'approved_for_payment'
        const booking = await Booking.findById(req.params.id).populate('workspace');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        let isAuthorized = false;

        if (req.user.role === 'admin') {
            isAuthorized = true;
        } else if (req.user.id === booking.user.toString()) {
            // User can only cancel
            if (status === 'cancelled') {
                isAuthorized = true;
            } else {
                return res.status(403).json({ message: 'Users can only cancel bookings' });
            }
        } else if (req.user.id === booking.workspace.owner.toString()) {
            // Owner can Approve (for payment), Reject, or Confirm (if paid manually?)
            // Flow: Pending -> Approved for Payment -> (User pays) -> Confirmed
            if (['approved_for_payment', 'rejected', 'confirmed'].includes(status)) {
                isAuthorized = true;
            } else {
                return res.status(403).json({ message: 'Owners can only approve or reject bookings' });
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
