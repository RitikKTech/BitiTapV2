const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// IMPORTS
const FreeSeller = require('../../models/free/FreeSeller'); 
const FreeProduct = require('../../models/free/FreeProduct');
const FreeOrder = require('../../models/free/FreeOrder');

// Middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: "No token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (e) { res.status(400).json({ msg: "Invalid Token" }); }
};

// 👉 GET Stats Route
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await FreeSeller.findById(req.user.user.id).select('-password');
        
        if (!user) {
            return res.json({ sellerName: 'Unknown', revenue: 0, totalSales: 0, productCount: 0 });
        }

        // ✅ PRODUCT COUNT
        const productCount = user.lifetimeProductCount || 0;

        // ✅ TOTAL SALES COUNT (Sirf 'approved' wale gino)
        const totalSales = await FreeOrder.countDocuments({ 
            seller: req.user.user.id,
            status: 'approved' 
        });

        // ✅ REVENUE FIX (Database se direct uthao - Lifetime Revenue)
        const currentRevenue = user.lifetimeRevenue || 0;

        res.json({
            sellerName: user.name,
            revenue: currentRevenue,
            totalSales: totalSales,
            productCount: productCount,
            settings: user.settings || {}
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;