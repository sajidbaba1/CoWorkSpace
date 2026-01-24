const express = require('express');
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
        const workspaces = await Workspace.find({ owner: req.user.id });
        res.json(workspaces);
    } catch (err) {
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

// Create a workspace (Owners only)
router.post('/', auth, authorize('owner', 'admin'), async (req, res) => {
    try {
        const workspaceData = {
            ...req.body,
            owner: req.user.id
        };
        const workspace = new Workspace(workspaceData);
        const newWorkspace = await workspace.save();
        res.status(201).json(newWorkspace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
