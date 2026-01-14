const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); // ✅ 1. New Add: Path module import kiya
require('dotenv').config();

const app = express();

// 1. Database Connect karo
connectDB();

// 2. Middleware (Basic Rules)
app.use(express.json()); // JSON data padhne ke liye
app.use(cors()); // Frontend se request aane dene ke liye

// ✅ 3. New Add: Uploads Folder ko Public banana (Image/QR dikhane ke liye zaroori)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routes (Raste) 🚦
// Old Logic Same to Same 👇
app.use('/api/free', require('./routes/free/freeAuth')); 
app.use('/api/free/products', require('./routes/free/freeProducts'));
// app.use('/api/free/products', require('./routes/free/freeProducts')); // (Duplicate thi, comment kar di)
app.use('/api/free/orders', require('./routes/free/freeOrders')); 
app.use('/api/free/settings', require('./routes/free/freeSettings'));
app.use('/api/free/dashboard', require('./routes/free/freeDashboard'));

// Test Route (Check karne ke liye ki server zinda he)
app.get('/', (req, res) => {
    res.send('API is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));