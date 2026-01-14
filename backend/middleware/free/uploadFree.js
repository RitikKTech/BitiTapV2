const multer = require('multer');
const { cloudinary, CloudinaryStorage } = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bititap_free_uploads', // Cloudinary me is naam ka folder banega
        allowed_formats: ['jpg', 'png', 'jpeg', 'zip', 'pdf', 'mp4'],
        resource_type: 'auto' // Auto detect (Image/Video/Raw)
    }
});

const uploadFree = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit (Free User)
});

module.exports = uploadFree;