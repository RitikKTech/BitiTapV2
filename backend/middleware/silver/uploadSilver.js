const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
require('../../config/cloudinary'); 

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

// 📂 EXPORTS FOR SILVER USER
module.exports = {
    // Silver Product -> 'bititap_v2/silver/products'
    uploadSilverProduct: multer({ storage: createStorage('bititap_v2/silver/products') }),
    
    // Silver QR -> 'bititap_v2/silver/qr'
    uploadSilverQr: multer({ storage: createStorage('bititap_v2/silver/qr') })
};