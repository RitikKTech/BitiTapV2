const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const FreeSeller = require('../../models/free/FreeSeller'); 
const FreeOrder = require('../../models/free/FreeOrder');

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: "No token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (e) { res.status(400).json({ msg: "Invalid Token" }); }
};

router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.user.id; // User ID from token
        const user = await FreeSeller.findById(userId).select('-password');
        
        if (!user) return res.json({ sellerName: 'Unknown', revenue: 0, totalSales: 0 });

        // ✅ FIX 1: SALES COUNT LOGIC
        // Hum database se puchenge ki kitne orders 'approved' hain
        const totalSales = await FreeOrder.countDocuments({ 
            seller: userId,
            status: 'approved' 
        });

        // ✅ FIX 2: REVENUE
        // Revenue database se direct uthayenge
        const revenue = user.lifetimeRevenue || 0;

        res.json({
            sellerName: user.name,
            revenue: revenue,
            totalSales: totalSales, // Ab ye 0 nahi, sahi ginti dikhayega
            productCount: user.lifetimeProductCount || 0,
            settings: user.settings || {}
        });

    } catch (err) {
        console.error("Dashboard Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;