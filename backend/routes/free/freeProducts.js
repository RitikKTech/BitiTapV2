const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');
const FreeProduct = require('../../models/free/FreeProduct'); 
const FreeSeller = require('../../models/free/FreeSeller'); 
const { uploadFreeProduct } = require('../../middleware/free/uploadFree'); 

console.log("✅ Free Products Route Loaded Successfully");

// ==========================================
// 1️⃣ PUBLIC PRODUCT ROUTE (Buyer Ke Liye)
// ==========================================
router.get('/public/:id', async (req, res) => {
    try {
        const product = await FreeProduct.findById(req.params.id)
            .populate('seller', 'name upiId qrCodeUrl'); 

        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error("❌ Public Fetch Error:", err.message);
        if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 2️⃣ ADD PRODUCT (POST) - (Back to Normal)
// ==========================================
router.post('/add', auth, uploadFreeProduct.single('file'), async (req, res) => {
    console.log("👉 Add Product Request Recieved");

    try {
        const { title, price, description } = req.body;

        // 🛑 Limit Check
        const currentCount = await FreeProduct.countDocuments({ seller: req.user.id });
        if (currentCount >= 15) {
             return res.status(400).json({ msg: "Limit Reached (15/15). Upgrade Plan!" });
        }

        if (!req.file) return res.status(400).json({ msg: "File upload failed" });
        if (!title || !price) return res.status(400).json({ msg: "Enter title and price" });

        // 🟢 FIX: Normal URL Save Karo (Raw files me modification mat karo)
        // Cloudinary ka original path hi sabse safe hai.
        // Humne uploadFree.js me 'raw' type set kiya hai, to ye PDF ab sahi khulegi.
        
        const newProduct = new FreeProduct({
            seller: req.user.id,
            title,
            price,
            description,
            fileUrl: req.file.path, // ✅ Original Path (No fl_attachment)
            filePublicId: req.file.filename 
        });

        const product = await newProduct.save();
        console.log("✅ Product Saved:", product.title);
        
        // Analytics
        await FreeSeller.findByIdAndUpdate(req.user.id, { $inc: { lifetimeProductCount: 1 } });

        res.json(product);

    } catch (err) {
        console.error("❌ Add Product Error:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// ==========================================
// 3️⃣ GET ALL & DELETE
// ==========================================
router.get('/', auth, async (req, res) => {
    try {
        const products = await FreeProduct.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await FreeProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        if (product.seller.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await product.deleteOne();
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;