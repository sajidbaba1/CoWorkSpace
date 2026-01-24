const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    platformFee: {
        type: Number,
        default: 0
    },
    ownerAmount: {
        type: Number,
        default: 0
    },
    isPaidOut: {
        type: Boolean,
        default: false
    },
    transactionId: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
