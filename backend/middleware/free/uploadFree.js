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
            
            // ✅ UPDATED FORMATS LIST (Audio, Video, Docs, Zip, Rar, Apk etc.)
            allowed_formats: [
                // Images
                'jpg', 'png', 'jpeg', 'webp',
                
                // Documents
                'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv',
                
                // Audio
                'mp3', 'wav', 'm4a',
                
                // Video
                'mp4', 'mkv', 'avi', 'mov',
                
                // Compressed / Software
                'zip', 'rar', '7z', 'apk'
            ],
            
            // 'auto' ka matlab Cloudinary khud detect karega ki ye image hai, video hai ya raw file
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