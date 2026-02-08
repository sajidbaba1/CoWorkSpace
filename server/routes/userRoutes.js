const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');

// Get current user details
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload Profile Image
router.post('/upload-profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const profileImageUrl = req.file.path;
        await User.findByIdAndUpdate(req.user.id, { profileImage: profileImageUrl });

        res.json({ success: true, profileImage: profileImageUrl });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload KYC (Aadhar)
router.post('/upload-kyc', auth, upload.single('aadharCard'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const aadharUrl = req.file.path;
        await User.findByIdAndUpdate(req.user.id, {
            aadharCard: aadharUrl,
            kycStatus: 'pending' // Move to pending verification
        });

        res.json({ success: true, aadharCard: aadharUrl, kycStatus: 'pending' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user wishlist
router.get('/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to wishlist
router.post('/wishlist/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const workspaceId = req.params.id;

        if (!user.favorites.some(fav => fav.toString() === workspaceId)) {
            user.favorites.push(workspaceId);
            await user.save();
        }
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove from wishlist
router.delete('/wishlist/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const workspaceId = req.params.id;

        user.favorites = user.favorites.filter(id => id.toString() !== workspaceId);
        await user.save();

        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
