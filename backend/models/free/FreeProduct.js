const mongoose = require('mongoose');

const FreeProductSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freeSeller',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    
    // 📂 CLOUDINARY FILE DATA (Feature #2)
    fileUrl: {
        type: String, // Downloadable link (PDF/Zip)
        required: true
    },
    filePublicId: {
        type: String, // Delete karne ke liye
        required: true
    },
    fileType: {
        type: String, // 'image', 'video', 'zip', 'pdf'
        default: 'zip'
    },
    
    // 🖼️ THUMBNAIL / COVER IMAGE
    coverUrl: {
        type: String,
        default: '' 
    },
    
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('freeProduct', FreeProductSchema);