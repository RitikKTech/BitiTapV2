const express = require('express');
const router = express.Router();
const auth = require('../../middleware/silver/auth'); // ✅ Silver Auth
const SilverSeller = require('../../models/silver/SilverSeller'); // ✅ Silver Model
const { uploadSilverQr } = require('../../middleware/silver/uploadSilver'); // ✅ Silver QR Upload

// @route   GET api/silver/settings
router.get('/', auth, async (req, res) => {
    try {
        const seller = await SilverSeller.findById(req.user.id).select('-password');
        res.json(seller);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/silver/settings/update
router.put('/update', auth, uploadSilverQr.single('qrCode'), async (req, res) => {
    try {
        const { upiId, autoApprove } = req.body;
        
        // Find Seller
        let seller = await SilverSeller.findById(req.user.id);
        if (!seller) return res.status(404).json({ msg: "User not found" });

        // Update Fields
        if (upiId) seller.upiId = upiId;
        
        // Auto Approve Logic (Silver can toggle this)
        if (autoApprove !== undefined) seller.autoApprove = autoApprove;

        // If New QR Uploaded
        if (req.file) {
            seller.qrCodeUrl = req.file.path; // Cloudinary URL (Silver QR Folder)
        }

        await seller.save();
        res.json({ msg: "Silver Settings Updated", settings: seller });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;