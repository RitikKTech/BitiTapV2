const express = require('express');
const router = express.Router();
const auth = require('../../middleware/gold/auth'); // 🥇 Gold Auth
const GoldSeller = require('../../models/gold/GoldSeller'); // 🥇 Gold Model
const { uploadGoldQr } = require('../../middleware/gold/uploadGold'); // 🥇 Gold Upload Middleware

// @route   GET api/gold/settings
// @desc    Get Gold User Settings
router.get('/', auth, async (req, res) => {
    try {
        // Password hata kar baaki details bhejo
        const seller = await GoldSeller.findById(req.user.id).select('-password');
        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/gold/settings/update
// @desc    Update UPI, Auto-Approve & QR Code
router.put('/update', auth, uploadGoldQr.single('qrCode'), async (req, res) => {
    try {
        const { upiId, autoApprove } = req.body;
        
        // 1. Find Seller
        let seller = await GoldSeller.findById(req.user.id);
        if (!seller) return res.status(404).json({ msg: "User not found" });

        // 2. Update Fields
        if (upiId) seller.upiId = upiId;
        
        // Auto Approve Logic (Gold User ke paas full control hota hai)
        if (autoApprove !== undefined) {
            seller.autoApprove = autoApprove === 'true' || autoApprove === true;
        }

        // 3. If New QR Image Uploaded (Cloudinary)
        if (req.file) {
            seller.qrCodeUrl = req.file.path; // Folder: bititap_v2/gold/qr
        }

        // 4. Save
        await seller.save();
        res.json({ msg: "Gold Settings Updated Successfully! 👑", settings: seller });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;