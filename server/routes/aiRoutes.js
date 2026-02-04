const express = require('express');
const router = express.Router();
const Workspace = require('../models/Workspace');

// Smart Recommendation Engine
router.post('/recommend', async (req, res) => {
    try {
        const { budget, location, requirement, facilities } = req.body;
        // requirements: 'meeting', 'individual', 'team'

        let query = {};

        // Filter by location (case insensitive partial match)
        if (location) {
            query.$or = [
                { location: { $regex: location, $options: 'i' } },
                { address: { $regex: location, $options: 'i' } }
            ];
        }

        // Filter by budget (Convert daily budget to hourly assumption, e.g. 8 hour day)
        if (budget) {
            // budget is per day, pricePerHour is per hour
            query.pricePerHour = { $lte: budget / 8 };
        }

        // Filter by facilities (amenities in DB)
        if (facilities && facilities.length > 0) {
            query.amenities = { $all: facilities };
        }

        let workspaces = await Workspace.find(query);

        // Simple "AI" scoring
        workspaces = workspaces.map(ws => {
            let score = 0;
            const wsObj = ws.toObject();

            // Score based on rating (if available) - assuming rating field exists or defaults
            if (wsObj.rating) score += wsObj.rating * 10;

            // Score based on facilities count
            if (wsObj.amenities) score += wsObj.amenities.length * 2;

            // Boost if matches specific requirement keywords in description
            if (requirement) {
                if (wsObj.description && wsObj.description.toLowerCase().includes(requirement.toLowerCase())) {
                    score += 20;
                }
            }

            wsObj.aiScore = score;
            return wsObj;
        });

        // Sort by score
        workspaces.sort((a, b) => b.aiScore - a.aiScore);

        res.json({
            success: true,
            count: workspaces.length,
            recommendations: workspaces
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
