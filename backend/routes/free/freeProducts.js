const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');
const FreeProduct = require('../../models/free/FreeProduct'); 
const FreeSeller = require('../../models/free/FreeSeller'); // ✅ Seller Model
const { uploadFreeProduct } = require('../../middleware/free/uploadFree'); 

// Debugging Log
console.log("✅ Free Products Route Loaded Successfully");

// ==========================================
// 1️⃣ PUBLIC PRODUCT ROUTE (Missing Tha - Ab Add Kar Diya)
// ==========================================
// Note: Isme 'auth' nahi lagega kyunki Buyer login nahi hota
router.get('/public/:id', async (req, res) => {
    try {
        // Product dhoondo aur Seller ki UPI/QR details bhi laao
        const product = await FreeProduct.findById(req.params.id)
            .populate('seller', 'name upiId qrCodeUrl'); 

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error("❌ Public Fetch Error:", err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 2️⃣ ADD PRODUCT (POST) + REAL LIMIT CHECK
// ==========================================
router.post('/add', auth, uploadFreeProduct.single('file'), async (req, res) => {
    console.log("👉 Add Product Request Recieved");

    try {
        const { title, price, description } = req.body;

        // 🛑 STEP 1: Check 15 Products Limit (100% Accurate Fix)
        // Hum Database se ginte hain ki abhi kitne product hain
        const currentCount = await FreeProduct.countDocuments({ seller: req.user.id });
        
        console.log(`📊 Current Products: ${currentCount}/15`);

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
        
        // (Optional) Analytics ke liye Lifetime Counter bada sakte hain
        await FreeSeller.findByIdAndUpdate(req.user.id, { $inc: { lifetimeProductCount: 1 } });

        res.json(product);

    } catch (err) {
        console.error("❌ SERVER ERROR:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// ==========================================
// 3️⃣ GET ALL PRODUCTS (GET)
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
// 4️⃣ DELETE PRODUCT (DELETE)
// ==========================================
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await FreeProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await product.deleteOne();

        // Note: Delete hone par count apne aap kam ho jayega 
        // kyunki hum ab seedha database se ginte hain (countDocuments)

        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;