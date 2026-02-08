const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/workspaces', require('./routes/workspaceRoutes.js'));
app.use('/api/bookings', require('./routes/bookingRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));
app.use('/api/reviews', require('./routes/reviewRoutes.js'));
app.use('/api/payments', require('./routes/paymentRoutes.js'));
app.use('/api/ai', require('./routes/aiRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// Error Handling Middleware (must be after routes)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error (e.g., file too large)
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Other errors
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
    next();
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
