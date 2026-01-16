const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
require('../../config/cloudinary'); // Cloudinary Config Load

// Helper Function
const createStorage = (folderPath) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folderPath,
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'zip'],
            resource_type: 'auto'
        },
    });
};

// 📂 EXPORTS FOR FREE USER
module.exports = {
    // Free Product Upload -> 'bititap_v2/free/products'
    uploadFreeProduct: multer({ storage: createStorage('bititap_v2/free/products') }),
    
    // Free QR Upload -> 'bititap_v2/free/qr'
    uploadFreeQr: multer({ storage: createStorage('bititap_v2/free/qr') })
};