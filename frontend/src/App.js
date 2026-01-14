import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ✅ Pages Import (Apna Old Logic)
import Home from './pages/Home'; 
import FreeLogin from './pages/free/Login';
import FreeSignup from './pages/free/Signup';
import FreeVerify from './pages/free/Verify';

// ✅ Dashboard Pages (Ab sidebar inke andar hai, isliye Layout wrapper hata diya)
import FreeDashboard from './pages/free/Dashboard';
import FreeProducts from './pages/free/Products';
import FreeOrders from './pages/free/Orders';
import FreeAddProduct from './pages/free/AddProduct';
import FreeSettings from './pages/free/Settings';
import FreeUpgrade from './pages/free/Upgrade';

// 👇 1. NEW IMPORT (Public Buy Page)
import FreeProductPublic from './pages/free/ProductPublic';

function App() {
  return (
    // 🛡️ future flags lagaye hain taaki console me yellow warnings na aayein
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* 🏠 Main Home Page */}
        <Route path="/" element={<Home />} />

        {/* 🔐 Auth Routes */}
        <Route path="/free/login" element={<FreeLogin />} />
        <Route path="/free/signup" element={<FreeSignup />} />
        <Route path="/free/verify/:token" element={<FreeVerify />} />

        {/* 🚀 Dashboard Routes (Direct Access, No Layout Wrapper) */}
        <Route path="/free/dashboard" element={<FreeDashboard />} />
        <Route path="/free/products" element={<FreeProducts />} />
        <Route path="/free/orders" element={<FreeOrders />} />
        <Route path="/free/add-product" element={<FreeAddProduct />} />
        <Route path="/free/settings" element={<FreeSettings />} />
        <Route path="/free/upgrade" element={<FreeUpgrade />} />

        {/* 👇 2. NEW ROUTE (Isse link kaam karega) */}
        {/* Jab koi /buy/kuch-bhi type karega, to ye page khulega */}
        <Route path="/buy/:id" element={<FreeProductPublic />} />

        {/* 🔄 Catch-all: Galat link par Home bhej do */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;