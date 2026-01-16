const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');

// ✅ Correct Import (Free Folder se)
const { uploadFreeProduct } = require('../../middleware/free/uploadFree'); 

// ✅ Correct Usage
router.post('/add', auth, uploadFreeProduct.single('file'), async (req, res) => {
    // ... tera code ...
});

module.exports = router;