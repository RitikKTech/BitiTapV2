const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Engine (Files sidhe Cloudinary jayengi)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bititap_products', // Cloudinary me folder ka naam
        resource_type: 'auto', // Image/Video/Zip sab allow hai
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };