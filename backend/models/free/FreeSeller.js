const mongoose = require('mongoose');

const FreeSellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // 💰 PAYOUT SETTINGS (Feature #7)
    upiId: {
        type: String,
        default: ''
    },
    qrCodeUrl: {
        type: String, // Cloudinary URL for QR Image
        default: ''
    },
    qrCodePublicId: {
        type: String, // Delete karne ke liye Cloudinary ID
        default: ''
    },

    // 🤖 AUTOMATION (Feature #4)
    autoApprove: {
        type: Boolean,
        default: false // By default OFF rahega
    },

    // 🔒 LOCKING SYSTEM COUNTERS (Feature #5 & #6)
    // Ye counters kabhi kam nahi honge, chahe product/order delete ho jaye
    lifetimeRevenue: {
        type: Number,
        default: 0
    },
    lifetimeProductCount: {
        type: Number,
        default: 0
    },

    // 📅 Meta Data
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String
});

module.exports = mongoose.model('freeSeller', FreeSellerSchema);