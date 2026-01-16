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

module.exports = {
    // 🥇 GOLD USERS (Separate Folders)
    uploadGoldProduct: multer({ storage: createStorage('bititap_v2/gold/products') }),
    uploadGoldQr: multer({ storage: createStorage('bititap_v2/gold/qr') })
};