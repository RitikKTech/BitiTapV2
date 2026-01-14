const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');
const { upload } = require('../../config/cloudinary'); // ✅ Old Code Safe
const FreeSeller = require('../../models/free/FreeSeller');

// 1. GET SETTINGS (Data dikhane ke liye)
router.get('/', auth, async (req, res) => {
    try {
        const seller = await FreeSeller.findById(req.user.id).select('upiId qrCodeUrl autoApprove');
        if (!seller) return res.status(404).json({ message: 'Seller not found' });
        res.json(seller);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. UPDATE SETTINGS (UPI, QR, Auto-Approve)
// ✅ Old Route '/update' Safe hai
// ✅ Old Field Name 'qrCode' Safe hai
router.put('/update', auth, upload.single('qrCode'), async (req, res) => {
    try {
        const { upiId, autoApprove } = req.body;
        const seller = await FreeSeller.findById(req.user.id);

        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        // Update Text Fields
        if (upiId) seller.upiId = upiId;
        
        // Auto Approve Toggle (Frontend se string "true"/"false" aata hai)
        if (autoApprove !== undefined) {
            seller.autoApprove = autoApprove === 'true' || autoApprove === true;
        }

        // ✅ QR UPDATE LOGIC (Cloudinary)
        // Agar naya QR Code upload kiya hai to purana replace karo
        if (req.file) {
            seller.qrCodeUrl = req.file.path;       // Cloudinary URL
            seller.qrCodePublicId = req.file.filename; // Cloudinary ID (Old Logic Safe)
        }

        await seller.save();

        // ✅ Response me updated settings bhejo taaki Frontend update ho jaye
        res.json({ 
            message: 'Settings Updated Successfully!', 
            settings: {
                upiId: seller.upiId,
                autoApprove: seller.autoApprove,
                qrCodeUrl: seller.qrCodeUrl
            }
        });

    } catch (err) {
        console.error("Settings Update Error:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;