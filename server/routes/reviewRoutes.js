const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// Create a review
router.post('/', auth, async (req, res) => {
    try {
        const { workspaceId, rating, comment } = req.body;

        // Check if user already reviewed this workspace (optional)
        const existingReview = await Review.findOne({ workspace: workspaceId, user: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this workspace' });
        }

        const review = new Review({
            workspace: workspaceId,
            user: req.user.id,
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get reviews for a workspace
router.get('/workspace/:workspaceId', async (req, res) => {
    try {
        const reviews = await Review.find({ workspace: req.params.workspaceId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
