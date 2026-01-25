const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/workspaces', require('./routes/workspaceRoutes.js'));
app.use('/api/bookings', require('./routes/bookingRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// MongoDB Connection & Server Start
const startServer = async () => {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Successfully connected to MongoDB Atlas');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API endpoints ready`);
        });
    } catch (err) {
        console.error('❌ CRITICAL: Failed to start server');
        console.error('Error:', err.message);
        if (err.message.includes('IP not whitelisted') || err.message.includes('server selection timeout')) {
            console.error('👉 ACTION REQUIRED: Whitelist your IP in MongoDB Atlas (Network Access).');
        }
        process.exit(1);
    }
};

startServer();
