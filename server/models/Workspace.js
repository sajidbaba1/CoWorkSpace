const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String },
    pricePerHour: { type: Number, required: true },
    type: { type: String, enum: ['Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room', 'Conference Hall'], default: 'Hot Desk' },
    amenities: [String],
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, default: 4.5 },
    capacity: { type: Number },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);
