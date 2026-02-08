const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Workspace = require('../models/Workspace');
const { auth, authorize } = require('../middleware/auth');

// Get all workspaces
router.get('/', async (req, res) => {
    try {
        const { search, limit = 20 } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const workspaces = await Workspace.find(query).limit(Number(limit));
        res.json(workspaces);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get my workspaces
router.get('/my', auth, authorize('owner', 'admin'), async (req, res) => {
    try {
        if (!req.user || !req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
            console.error('Invalid user ID in /workspaces/my:', req.user);
            return res.status(400).json({ message: 'Invalid User ID' });
        }
        const workspaces = await Workspace.find({ owner: req.user.id });
        res.json(workspaces);
    } catch (err) {
        console.error('Error in /workspaces/my:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get single workspace
router.get('/:id', async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id).populate('owner', 'name email');
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
        res.json(workspace);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const upload = require('../middleware/upload');

// Create a workspace (Owners only)
router.post('/', auth, authorize('owner', 'admin'), upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        const workspaceData = {
            ...req.body,
            owner: req.user.id,
            images: imagePaths
        };
        const workspace = new Workspace(workspaceData);
        const newWorkspace = await workspace.save();
        res.status(201).json(newWorkspace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a workspace (Owner only)
router.delete('/:id', auth, authorize('owner', 'admin'), async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        // Check if user is owner
        if (workspace.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this workspace' });
        }

        await Workspace.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workspace deleted successfully', id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
