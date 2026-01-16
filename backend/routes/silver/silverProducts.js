const express = require('express');
const router = express.Router();
const auth = require('../../middleware/silver/auth'); // ✅ Silver Auth
const SilverProduct = require('../../models/silver/SilverProduct'); // ✅ Silver Model
const { uploadSilverProduct } = require('../../middleware/silver/uploadSilver'); // ✅ Silver Upload

// @route   POST api/silver/products/add
// @desc    Add new product (Limit: 50)
router.post('/add', auth, uploadSilverProduct.single('file'), async (req, res) => {
    try {
        const { title, price, description } = req.body;

        // 1. Check Product Limit (Silver = 50 Max)
        const productCount = await SilverProduct.countDocuments({ seller: req.user.id });
        if (productCount >= 50) {
            return res.status(400).json({ msg: "Silver Limit Reached (50 Products). Upgrade to Gold!" });
        }

        // 2. Validate File
        if (!req.file) return res.status(400).json({ msg: "Please upload a file" });

        // 3. Create Product
        const newProduct = new SilverProduct({
            seller: req.user.id,
            title,
            price,
            description,
            fileUrl: req.file.path, // Cloudinary URL (Silver Folder)
            publicId: req.file.filename
        });

        const product = await newProduct.save();
        res.json(product);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/silver/products
// @desc    Get all silver products
router.get('/', auth, async (req, res) => {
    try {
        const products = await SilverProduct.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/silver/products/:id
// @desc    Delete product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await SilverProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Verify Owner
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;