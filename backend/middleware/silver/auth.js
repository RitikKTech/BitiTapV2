const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Token Header se nikal
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Token Decode kar
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check kar ki ye Silver Seller hi hai na?
        // (Humne payload me 'role' add kiya hoga login ke waqt)
        if(decoded.role !== 'silver') {
            return res.status(403).json({ msg: 'Access denied. Silver Plan required.' });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};