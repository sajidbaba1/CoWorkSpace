const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

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

        if (!user.favorites.includes(workspaceId)) {
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
