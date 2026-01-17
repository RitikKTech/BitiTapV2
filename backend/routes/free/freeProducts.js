const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');
const FreeProduct = require('../../models/free/FreeProduct'); 
const FreeSeller = require('../../models/free/FreeSeller'); // ✅ Seller Model Import (Zaroori hai)
const { uploadFreeProduct } = require('../../middleware/free/uploadFree'); 

// Debugging Log
console.log("✅ Free Products Route Loaded Successfully");

// ==========================================
// 1️⃣ ADD PRODUCT (POST) + LIMIT CHECK + COUNTER UPDATE
// ==========================================
router.post('/add', auth, uploadFreeProduct.single('file'), async (req, res) => {
    console.log("👉 Add Product Request Recieved");

    try {
        const { title, price, description } = req.body;

        // 🛑 STEP 1: Check 15 Products Limit
        const seller = await FreeSeller.findById(req.user.id);
        
        // Agar counter nahi hai to 0 maan lo, aur agar 15 se zyada hai to roko
        const currentCount = seller.productsCount || 0; 
        
        if (currentCount >= 15) {
             console.log("❌ Limit Reached: 15/15");
             return res.status(400).json({ msg: "Free Plan Limit Reached (15/15). Upgrade to Silver!" });
        }

        // 📁 STEP 2: File Check
        if (!req.file) {
            console.log("❌ Error: No File Uploaded");
            return res.status(400).json({ msg: "File upload failed" });
        }

        // 📝 STEP 3: Validation
        if (!title || !price) {
            return res.status(400).json({ msg: "Please enter title and price" });
        }

        // 💾 STEP 4: Create Product
        const newProduct = new FreeProduct({
            seller: req.user.id,
            title,
            price,
            description,
            fileUrl: req.file.path,      
            filePublicId: req.file.filename 
        });

        const product = await newProduct.save();
        console.log("✅ Product Saved to DB:", product.title);

        // ➕ STEP 5: Increment Product Count (+1 Logic)
        seller.productsCount = currentCount + 1;
        await seller.save();
        console.log(`✅ Counter Updated: ${seller.productsCount}/15`);
        
        res.json(product);

    } catch (err) {
        console.error("❌ SERVER ERROR:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// ==========================================
// 2️⃣ GET ALL PRODUCTS (GET)
// ==========================================
router.get('/', auth, async (req, res) => {
    try {
        const products = await FreeProduct.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error("❌ GET Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 3️⃣ DELETE PRODUCT (DELETE) + DECREMENT COUNTER
// ==========================================
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await FreeProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await product.deleteOne();

        // ➖ STEP 6: Decrement Counter (-1 Logic)
        const seller = await FreeSeller.findById(req.user.id);
        if (seller.productsCount > 0) {
            seller.productsCount = seller.productsCount - 1;
            await seller.save();
        }

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;