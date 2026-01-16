const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); 
require('dotenv').config();

const app = express();

// 1. Database Connect karo
connectDB();

// 2. Middleware (Basic Rules)
app.use(express.json()); // JSON data padhne ke liye
app.use(cors()); // Frontend se request aane dene ke liye

// ✅ 3. Uploads Folder ko Public banana (Legacy support ke liye rakha hai)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===================================================
// 🟢 FREE USER ROUTES (Old Logic - 100% Safe)
// ===================================================
app.use('/api/free', require('./routes/free/freeAuth')); 
app.use('/api/free/products', require('./routes/free/freeProducts'));
app.use('/api/free/orders', require('./routes/free/freeOrders')); 
app.use('/api/free/settings', require('./routes/free/freeSettings'));
app.use('/api/free/dashboard', require('./routes/free/freeDashboard'));

// ===================================================
// 🥈 SILVER USER ROUTES (New Added)
// ===================================================
// Note: Jab Silver Signup banayega tab niche wali line uncomment karna
// app.use('/api/silver/auth', require('./routes/silver/silverAuth')); 

app.use('/api/silver/products', require('./routes/silver/silverProducts'));
app.use('/api/silver/settings', require('./routes/silver/silverSettings'));

// ===================================================
// 🥇 GOLD USER ROUTES (New Added)
// ===================================================
// Note: Jab Gold Signup banayega tab niche wali line uncomment karna
// app.use('/api/gold/auth', require('./routes/gold/goldAuth'));

app.use('/api/gold/products', require('./routes/gold/goldProducts'));
app.use('/api/gold/settings', require('./routes/gold/goldSettings'));


// Test Route (Check karne ke liye ki server zinda he)
app.get('/', (req, res) => {
    res.send('API is Running... 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));