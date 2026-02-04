const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const { auth, authorize } = require('../middleware/auth');

// Create Complaint (User level)
router.post('/complaints/create', auth, async (req, res) => {
    try {
        const { subject, description } = req.body;
        const complaint = new Complaint({
            user: req.user.id,
            subject,
            description
        });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// All following routes require admin role
router.use(auth, authorize('admin'));

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalOwners = await User.countDocuments({ role: 'owner' });
        const totalWorkspaces = await Workspace.countDocuments();
        const pendingWorkspaces = await Workspace.countDocuments({ isVerified: false });
        const totalBookings = await Booking.countDocuments();

        const financials = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: null,
                    grossRevenue: { $sum: '$totalPrice' },
                    netRevenue: { $sum: '$platformFee' }, // Admin Commission
                    payoutPending: {
                        $sum: {
                            $cond: [{ $eq: ['$isPaidOut', false] }, '$ownerAmount', 0]
                        }
                    }
                }
            }
        ]);

        const stats = financials[0] || { grossRevenue: 0, netRevenue: 0, payoutPending: 0 };

        res.json({
            stats: {
                totalUsers,
                totalOwners,
                totalWorkspaces,
                pendingWorkspaces,
                totalBookings,
                grossRevenue: stats.grossRevenue,
                netRevenue: stats.netRevenue,
                payoutPending: stats.payoutPending
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Analytics (Chart Data)
router.get('/analytics', async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Booking.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    revenue: { $sum: '$totalPrice' },
                    commission: { $sum: '$platformFee' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Map month numbers to names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedData = monthlyRevenue.map(item => ({
            name: monthNames[item._id - 1],
            revenue: item.revenue,
            commission: item.commission
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Payout Management
router.get('/payouts', async (req, res) => {
    try {
        const payouts = await Booking.aggregate([
            { $match: { paymentStatus: 'paid', isPaidOut: false } },
            {
                $lookup: {
                    from: 'workspaces',
                    localField: 'workspace',
                    foreignField: '_id',
                    as: 'workspaceDetails'
                }
            },
            { $unwind: '$workspaceDetails' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'workspaceDetails.owner',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            },
            { $unwind: '$ownerDetails' },
            {
                $group: {
                    _id: '$ownerDetails._id',
                    ownerName: { $first: '$ownerDetails.name' },
                    ownerEmail: { $first: '$ownerDetails.email' },
                    totalAmount: { $sum: '$ownerAmount' },
                    bookingsCount: { $sum: 1 },
                    bookingIds: { $push: '$_id' }
                }
            }
        ]);
        res.json(payouts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/payouts/process', async (req, res) => {
    try {
        const { bookingIds } = req.body;
        await Booking.updateMany(
            { _id: { $in: bookingIds } },
            { $set: { isPaidOut: true } }
        );
        res.json({ message: 'Payout processed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cancel Booking (Admin Override)
router.delete('/bookings/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Management
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Workspace Management
router.get('/workspaces/pending', async (req, res) => {
    try {
        const workspaces = await Workspace.find({ isVerified: false }).populate('owner', 'name email');
        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/workspaces/:id/verify', async (req, res) => {
    try {
        const { isVerified } = req.body;
        const workspace = await Workspace.findByIdAndUpdate(
            req.params.id,
            { isVerified },
            { new: true }
        );
        res.json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Workspace (Reject)
router.delete('/workspaces/:id', async (req, res) => {
    try {
        await Workspace.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workspace deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Booking Management
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('workspace')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Complaint Management
router.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/complaints/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
