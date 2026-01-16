const express = require('express');
const router = express.Router();
const auth = require('../../middleware/gold/auth'); // 🥇 Gold Auth
const GoldProduct = require('../../models/gold/GoldProduct'); // 🥇 Gold Model (Create this model like Silver)
const { uploadGoldProduct } = require('../../middleware/gold/uploadGold'); // 🥇 Gold Upload

// @route   POST api/gold/products/add
// @desc    Add Product (UNLIMITED - No Check)
router.post('/add', auth, uploadGoldProduct.single('file'), async (req, res) => {
    try {
        const { title, price, description } = req.body;

        // ❌ NO LIMIT CHECK HERE (Unlimited Products)

        if (!req.file) return res.status(400).json({ msg: "File is required" });

        const newProduct = new GoldProduct({
            seller: req.user.id,
            title,
            price,
            description,
            fileUrl: req.file.path, // Gold Folder
            publicId: req.file.filename
        });

        const product = await newProduct.save();
        res.json(product);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET aur DELETE route Silver jaisa hi hoga bas 'GoldProduct' use karna
// ... (Copy GET/DELETE from Silver and replace Model) ...

module.exports = router;