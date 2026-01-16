const mongoose = require('mongoose');

const GoldProductSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'goldSeller', // 👈 Yeh Model bhi hona chahiye
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    
    // Cloudinary Info
    fileUrl: { type: String, required: true },
    publicId: { type: String },

    totalSales: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('goldProduct', GoldProductSchema);