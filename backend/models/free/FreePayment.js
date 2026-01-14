const mongoose = require('mongoose');

const FreePaymentSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FreeSeller',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    utrNumber: {
        type: String,
        required: true
    },
    planType: {
        type: String,
        default: 'free_upgrade' // Agar kabhi plan upgrade kiya to
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FreePayment', FreePaymentSchema);