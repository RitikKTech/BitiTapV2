const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');
const FreeSeller = require('../../models/free/FreeSeller'); // ✅ Model Import Zaroori Hai
const { uploadFreeQr } = require('../../middleware/free/uploadFree'); // ✅ Correct Import

// ==========================================
// 1️⃣ GET SETTINGS (GET /api/free/settings)
// ==========================================
// 🚨 YEH MISSING THA - AB LAGA DIYA HAI
router.get('/', auth, async (req, res) => {
    try {
        // User ko dhoondo (Password chhod kar baaki sab bhejo)
        const seller = await FreeSeller.findById(req.user.id).select('-password');
        
        if (!seller) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(seller);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 2️⃣ UPDATE SETTINGS (PUT /api/free/settings/update)
// ==========================================
router.put('/update', auth, uploadFreeQr.single('qrCode'), async (req, res) => {
    try {
        const { upiId } = req.body;
        
        // Find User
        let seller = await FreeSeller.findById(req.user.id);
        if (!seller) return res.status(404).json({ msg: "User not found" });

        // Update Fields
        if (upiId) seller.upiId = upiId; // Agar UPI ID bheji hai to update karo

        // Agar QR Code Image bhi upload ki hai
        if (req.file) {
            seller.qrCodeUrl = req.file.path; // Cloudinary URL save karo
        }

        await seller.save();
        res.json({ msg: "Settings Updated Successfully! ✅", settings: seller });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;