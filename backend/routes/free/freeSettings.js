const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');

// ✅ Correct Import for QR
const { uploadFreeQr } = require('../../middleware/free/uploadFree'); 

// ✅ Correct Usage
router.put('/update', auth, uploadFreeQr.single('qrCode'), async (req, res) => {
    // ... tera code ...
});

module.exports = router;