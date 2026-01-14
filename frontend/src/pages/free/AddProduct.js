import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings } from 'lucide-react';
import './Dashboard.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // State wahi purana
    const [form, setForm] = useState({ name: '', price: '', description: '', file: null });
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        // 1. Basic Validation
        if (!form.file) { alert("Please select a file!"); return; }

        // ✅ NEW LOGIC: Confirmation Popup
        // Agar user 'Cancel' dabayega to ye function yahin ruk jayega (return)
        const isConfirmed = window.confirm("Are you sure you want to Launch this Product? \nThis will count as +1 in your limit.");
        if (!isConfirmed) return; 

        // Agar 'OK' kiya, tabhi aage badhenge
        setUploading(true);
        
        const formData = new FormData();
        // Backend 'title' mang raha hai, frontend 'name' store kar raha hai
        formData.append('title', form.name); 
        formData.append('price', form.price);
        formData.append('description', form.description);
        formData.append('file', form.file);

        try {
            // Sahi URL jo humne fix kiya tha
            await axios.post('http://localhost:5000/api/free/products/add', formData, {
                headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
            });
            
            alert("Product Added Successfully! 🚀");
            navigate('/free/products');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error Adding Product");
        } finally { setUploading(false); }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-logo">bititap</div>
                <nav style={{display:'flex', width:'100%', flexDirection:'inherit', justifyContent:'inherit', gap:'inherit'}}>
                    <Link to="/free/dashboard" className={`nav-item ${location.pathname === '/free/dashboard' ? 'active' : ''}`}><LayoutDashboard size={20}/> <span>Overview</span></Link>
                    <Link to="/free/products" className={`nav-item ${location.pathname === '/free/products' ? 'active' : ''}`}><Package size={20}/> <span>Products</span></Link>
                    <Link to="/free/orders" className={`nav-item ${location.pathname === '/free/orders' ? 'active' : ''}`}><ShoppingCart size={20}/> <span>Sales</span></Link>
                    <Link to="/free/settings" className={`nav-item ${location.pathname === '/free/settings' ? 'active' : ''}`}><Settings size={20}/> <span>Settings</span></Link>
                </nav>
            </aside>

            <main className="main-content">
                <h2 className="welcome-text">Add Product ✨</h2>
                <div className="glass-card" style={{maxWidth:'500px'}}>
                    <form onSubmit={handleSubmit}>
                        <input className="input-field" placeholder="Product Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
                        <input className="input-field" type="number" placeholder="Price (₹)" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required />
                        <textarea className="input-field" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
                        <div style={{marginBottom:'15px'}}>
                            <input type="file" onChange={e => setForm({...form, file: e.target.files[0]})} required />
                        </div>
                        
                        {/* Button wahi purana */}
                        <button disabled={uploading} className="btn-primary" style={{width:'100%', justifyContent:'center'}}>
                            {uploading ? 'Uploading...' : 'Launch Product 🚀'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddProduct;