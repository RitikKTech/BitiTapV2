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
        // Product delete ho jaye to bhi order rahega, isliye 'required' nahi lagaya
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

    // 💸 PAYMENT INFO (Feature #3)
    utr: {
        type: String,
        required: true // UTR dalna zaroori hai
    },
    isApproved: {
        type: Boolean,
        default: false // Pehle false rahega, Seller approve karega tab true hoga
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('freeOrder', FreeOrderSchema);