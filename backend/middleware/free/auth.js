const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Header se token nikalo
    const token = req.header('x-auth-token');

    // Check karo agar token nahi hai
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Token verify karo
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};