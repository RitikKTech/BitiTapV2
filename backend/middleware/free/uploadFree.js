const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path'); 
require('dotenv').config();
require('../../config/cloudinary'); 

// 🧠 SMART STORAGE ENGINE (With Name Sanitizer)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        
        // 1. Extension nikalo
        const ext = path.extname(file.originalname).toLowerCase();
        
        // 🚨 NAME CLEANER (Sabse Important Step)
        // Spaces ko '_' bana do aur Brackets/Symbols hata do
        let name = path.basename(file.originalname, ext);
        name = name.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');

        let resourceType = 'auto';
        let folderPath = 'bititap_v2/free/products';

        // 🎯 2. Type Detection
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            resourceType = 'image';
        } 
        else if (['.mp3', '.wav', '.mp4', '.mkv', '.mov', '.avi'].includes(ext)) {
            resourceType = 'video'; 
        } 
        else {
            resourceType = 'raw'; // PDF, Zip, Rar (Safe Mode)
        }

        // 📷 QR Code
        if (file.fieldname === 'qrCode') {
            folderPath = 'bititap_v2/free/qr';
            resourceType = 'image';
        }

        return {
            folder: folderPath,
            resource_type: resourceType,
            
            // ✅ Clean Name Use Karo
            public_id: resourceType === 'raw' 
                ? `${name}-${Date.now()}${ext}` 
                : `${name}-${Date.now()}`,
                
            format: resourceType === 'raw' ? undefined : ext.replace('.', '') 
        };
    },
});

// 📂 EXPORTS
module.exports = {
    uploadFreeProduct: multer({ storage: storage }),
    uploadFreeQr: multer({ storage: storage })
};