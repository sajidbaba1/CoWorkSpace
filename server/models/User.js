const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
    profileImage: { type: String, default: null },
    aadharCard: { type: String, default: null }, // URL to uploaded file
    kycStatus: { type: String, enum: ['pending', 'verified', 'rejected', 'not_submitted'], default: 'not_submitted' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
