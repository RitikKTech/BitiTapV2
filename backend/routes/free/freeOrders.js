const express = require('express');
const router = express.Router();
const auth = require('../../middleware/free/auth'); 
const FreeOrder = require('../../models/free/FreeOrder');
const FreeProduct = require('../../models/free/FreeProduct');
const FreeSeller = require('../../models/free/FreeSeller');

// ==========================================
// 1. PLACE ORDER (Buyer UTR Submit karega)
// ==========================================
router.post('/place', async (req, res) => {
    const { productId, buyerName, buyerEmail, buyerPhone, utr } = req.body;

    try {
        // A. Product aur Seller dhundo
        const product = await FreeProduct.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const seller = await FreeSeller.findById(product.seller);
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        // 🤖 AUTO-APPROVAL LOGIC ⚡
        const initialStatus = seller.autoApprove ? 'approved' : 'pending';

        // Agar Auto-Approve hai, to ABHI Revenue badha do
        if (initialStatus === 'approved') {
            const price = Number(product.price) || 0;
            const currentRev = Number(seller.lifetimeRevenue) || 0;
            seller.lifetimeRevenue = currentRev + price;
            await seller.save();
        }

        // B. Order Create karo
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

        // C. Response Bhejo
        res.json({ 
            message: initialStatus === 'approved' ? 'Order Approved Instantly!' : 'UTR Submitted! Waiting for Approval.',
            orderId: newOrder._id,
            downloadLink: initialStatus === 'approved' ? product.fileUrl : null,
            status: initialStatus
        });

    } catch (err) {
        console.error("Place Order Error:", err);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 2. GET ALL ORDERS (Seller Dashboard ke liye)
// ==========================================
router.get('/', auth, async (req, res) => {
    try {
        const orders = await FreeOrder.find({ seller: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Get Orders Error:", err);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 3. CHECK SINGLE ORDER (Buyer Polling Route) 🟢
// ==========================================
// ✅ MAIN FIX HERE: Buyer yahi route check karta hai
router.get('/:id', async (req, res) => {
    try {
        // Cache disable karo taaki browser har baar naya status mangwaye
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");

        const order = await FreeOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        let productUrl = null;

        // ✅ Check: Agar Status 'approved' hai, tabhi Product database se Link nikalo
        if (order.status === 'approved') {
            // Hum Product ko dhund rahe hain taaki uska 'fileUrl' mil sake
            const product = await FreeProduct.findById(order.product);
            
            if (product) {
                productUrl = product.fileUrl; // Ye Link Buyer ko jayega
            } else {
                console.log("⚠️ Product not found for approved order!");
            }
        }

        // Debugging ke liye Console me print karo
        // Isse tuje VS Code me dikhega ki Buyer check kar raha hai
        if(order.status === 'pending') {
            // console.log(`⏳ Waiting: Buyer checking status for ${order._id}`);
        } else if (order.status === 'approved') {
            console.log(`✅ Sent Link to Buyer for Order: ${order._id}`);
        }

        res.json({
            status: order.status,
            productLink: productUrl // Frontend iska wait kar raha hai
        });

    } catch (err) {
        console.error("Check Status Error:", err);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 4. APPROVE ORDER (Manual by Seller) ✅
// ==========================================
router.put('/:id/approve', auth, async (req, res) => {
    try {
        const order = await FreeOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not Authorized' });
        }

        if (order.status === 'approved') {
            return res.status(400).json({ message: 'Order already approved' });
        }

        // A. Order ko Approve mark karo
        order.status = 'approved';
        await order.save();

        // B. 💰 Seller ka Lifetime Revenue badhao
        const seller = await FreeSeller.findById(req.user.id);
        const orderAmount = Number(order.productPrice) || 0;
        const currentRevenue = Number(seller.lifetimeRevenue) || 0;

        seller.lifetimeRevenue = currentRevenue + orderAmount;
        await seller.save();

        console.log(`Order Approved. Added ₹${orderAmount} to seller revenue.`);

        res.json({ message: 'Order Approved! Revenue Updated.', order });

    } catch (err) {
        console.error("Approve Error:", err);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 5. REJECT / DELETE ORDER
// ==========================================
router.delete('/:id', auth, async (req, res) => {
    try {
        const order = await FreeOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not Authorized' });
        }

        // 🛑 Approved Order Delete Nahi Hoga
        if (order.status === 'approved') {
            return res.status(400).json({ message: 'Cannot delete Approved orders!' });
        }

        await order.deleteOne();
        res.json({ message: 'Order Rejected/Deleted' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;