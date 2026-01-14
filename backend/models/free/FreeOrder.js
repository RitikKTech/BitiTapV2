const mongoose = require('mongoose');

const FreeOrderSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeSeller',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeProduct'
    },
    productTitle: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },

    // 👤 BUYER INFO
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },

    // 💸 PAYMENT INFO
    utr: {
        type: String,
        required: true
    },
    
    // 🚨 MAIN FIX: 'isApproved' hata kar 'status' lagaya
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending' 
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('freeOrder', FreeOrderSchema);