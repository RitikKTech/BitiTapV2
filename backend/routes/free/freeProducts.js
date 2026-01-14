const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth');
const { upload } = require('../../config/cloudinary');
const FreeProduct = require('../../models/free/FreeProduct');
const FreeSeller = require('../../models/free/FreeSeller');

// 1. ADD PRODUCT (With 15 Product & 3000 Revenue Lock) 🔒
router.post('/add', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        
        // A. Seller ko dhundo
        const seller = await FreeSeller.findById(req.user.id);

        // B. 🛑 LOCK CHECKING LOGIC
        if (seller.lifetimeRevenue >= 3000) {
            return res.status(403).json({ message: 'Revenue Limit Reached (₹3000). Please Upgrade.' });
        }
        if (seller.lifetimeProductCount >= 15) {
            return res.status(403).json({ message: 'Product Limit Reached (15 Items). Please Upgrade.' });
        }

        // C. Agar Lock nahi hai, to Product banao
        const newProduct = new FreeProduct({
            seller: req.user.id,
            title,
            description,
            price,
            fileUrl: req.file.path,       // Cloudinary URL
            filePublicId: req.file.filename // Cloudinary ID
        });

        await newProduct.save();

        // D. 🔢 Counter Badhao
        seller.lifetimeProductCount += 1;
        await seller.save();

        res.json({ message: 'Product Added Successfully!', product: newProduct });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ✅ NEW ADDITION: Root Route for Frontend Fix (GET /)
// Frontend 'http://localhost:5000/api/free/products' call kar raha hai, wo yahan aayega.
router.get('/', auth, async (req, res) => {
    try {
        const products = await FreeProduct.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. GET MY PRODUCTS (Old Route - Ise bhi rakha hai backup ke liye)
router.get('/my-products', auth, async (req, res) => {
    try {
        const products = await FreeProduct.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 3. DELETE PRODUCT (Counter kam NAHI hoga - No Cheating Rule)
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await FreeProduct.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not Authorized' });
        }

        // Cloudinary Delete Logic (Optional)
        // await cloudinary.uploader.destroy(product.filePublicId);

        await product.deleteOne();
        
        res.json({ message: 'Product Removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 4. PUBLIC PRODUCT VIEW (Buyer ke liye)
router.get('/public/:id', async (req, res) => {
    try {
        const product = await FreeProduct.findById(req.params.id).populate('seller', 'name upiId qrCodeUrl autoApprove');
        if(!product) return res.status(404).json({message: 'Product not found'});
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ... Upar ka sara code same rahega ...

// 5. EDIT PRODUCT (Update Logic) ✅
router.put('/:id', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        
        // Product dhundo
        let product = await FreeProduct.findById(req.params.id);
        if(!product) return res.status(404).json({message: 'Product not found'});

        // Check Owner
        if(product.seller.toString() !== req.user.id) {
            return res.status(401).json({message: 'Not Authorized'});
        }

        // Update Fields (Jo naya aaya hai wahi badlo)
        if(title) product.title = title;
        if(description) product.description = description;
        if(price) product.price = price;

        // Agar nayi file upload ki hai to update karo
        if(req.file) {
            product.fileUrl = req.file.path;
            product.filePublicId = req.file.filename;
        }

        await product.save();
        res.json({ message: "Product Updated Successfully!", product });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;