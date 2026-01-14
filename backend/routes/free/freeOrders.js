const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth'); 
const FreeOrder = require('../../models/free/FreeOrder');
const FreeProduct = require('../../models/free/FreeProduct');
const FreeSeller = require('../../models/free/FreeSeller');

// 1. PLACE ORDER
router.post('/place', async (req, res) => {
    const { productId, buyerName, buyerEmail, buyerPhone, utr } = req.body;
    try {
        const product = await FreeProduct.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const seller = await FreeSeller.findById(product.seller);
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        const initialStatus = seller.autoApprove ? 'approved' : 'pending';

        // Auto Approve Logic
        if (initialStatus === 'approved') {
            const price = Number(product.price) || 0;
            const currentRev = Number(seller.lifetimeRevenue) || 0;
            seller.lifetimeRevenue = currentRev + price;
            await seller.save();
        }

        const newOrder = new FreeOrder({
            seller: product.seller,
            product: productId,
            productTitle: product.title,
            productPrice: product.price,
            buyerName,
            buyerEmail,
            buyerPhone,
            utr,
            status: initialStatus, 
            date: Date.now()
        });

        await newOrder.save();

        res.json({ 
            message: 'Order Placed',
            orderId: newOrder._id,
            downloadLink: initialStatus === 'approved' ? product.fileUrl : null,
            status: initialStatus
        });
    } catch (err) {
        console.error("Place Order Error:", err);
        res.status(500).send('Server Error');
    }
});

// 🔍 2. POLLING CHECK (DEBUG MODE ACTIVATED) 🔍
router.get('/:id', async (req, res) => {
    try {
        // Anti-Cache Header
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");

        const order = await FreeOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        console.log(`\n🔍 CHECKING ORDER: ${req.params.id}`);
        console.log(`👉 Status: ${order.status}`);
        
        let productUrl = null;
        if (order.status === 'approved') {
            // Product dhoondo
            const product = await FreeProduct.findById(order.product);
            
            if (product) {
                console.log(`✅ Product Found: ${product.title}`);
                console.log(`📂 File URL from DB: ${product.fileUrl}`);
                productUrl = product.fileUrl; // <--- YAHAN SE LINK JAATA HAI
            } else {
                console.log(`❌ ERROR: Product with ID ${order.product} NOT FOUND in DB!`);
            }
        } else {
            console.log(`⏳ Order is still Pending...`);
        }

        res.json({
            status: order.status,
            productLink: productUrl 
        });

    } catch (err) {
        console.error("Polling Error:", err);
        res.status(500).send('Server Error');
    }
});

// 3. APPROVE ORDER
router.put('/:id/approve', auth, async (req, res) => {
    try {
        const order = await FreeOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status === 'approved') return res.status(400).json({ message: 'Already approved' });

        // Update Order
        order.status = 'approved';
        await order.save();
        console.log(`✅ Order ${order._id} MARKED AS APPROVED`);

        // Update Revenue
        const seller = await FreeSeller.findById(req.user.id);
        const amount = Number(order.productPrice) || 0;
        const currentRev = Number(seller.lifetimeRevenue) || 0;
        
        seller.lifetimeRevenue = currentRev + amount;
        await seller.save();
        console.log(`💰 Revenue Updated: +₹${amount}`);

        res.json({ message: 'Approved & Revenue Added' });

    } catch (err) {
        console.error("Approve Error:", err);
        res.status(500).send('Server Error');
    }
});

// 4. GET ALL ORDERS
router.get('/', auth, async (req, res) => {
    try {
        const orders = await FreeOrder.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) { res.status(500).send('Server Error'); }
});

// 5. DELETE ORDER
router.delete('/:id', auth, async (req, res) => {
    try {
        await FreeOrder.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;