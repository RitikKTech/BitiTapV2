import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, Trash2, ExternalLink, Edit, X, Save } from 'lucide-react';
import './Dashboard.css';

const Products = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🛠️ EDIT STATE (Popup ke liye)
    const [editingProduct, setEditingProduct] = useState(null); // Agar ye null nahi hai, to popup dikhega
    const [editForm, setEditForm] = useState({ title: '', price: '', description: '', file: null });
    const [updating, setUpdating] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/free/products', { headers: { 'x-auth-token': token } });
            setProducts(res.data);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    // 🗑️ DELETE Logic
    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure? This will delete the product permanently.")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/free/products/${id}`, { headers: { 'x-auth-token': token } });
            alert("Product Deleted"); fetchProducts();
        } catch(err) { alert("Error deleting product"); }
    };

    // ✏️ OPEN EDIT MODAL
    const handleEditClick = (product) => {
        setEditingProduct(product._id);
        setEditForm({ 
            title: product.title, 
            price: product.price, 
            description: product.description,
            file: null // File optional hai update karte waqt
        });
    };

    // 💾 SAVE UPDATES
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('price', editForm.price);
        formData.append('description', editForm.description);
        if(editForm.file) formData.append('file', editForm.file);

        try {
            await axios.put(`http://localhost:5000/api/free/products/${editingProduct}`, formData, {
                headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
            });
            alert("Product Updated Successfully! 🎉");
            setEditingProduct(null); // Popup band karo
            fetchProducts(); // List refresh karo
        } catch (err) {
            alert(err.response?.data?.message || "Error Updating Product");
        } finally { setUpdating(false); }
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

            <main className="main-content" style={{position:'relative'}}>
                <h2 className="welcome-text">My Products 📦</h2>
                
                {/* 👇 EDIT MODAL (POPUP) 👇 */}
                {editingProduct && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div className="glass-card" style={{width: '400px', background: 'white', position: 'relative'}}>
                            <button onClick={()=>setEditingProduct(null)} style={{position:'absolute', right:'15px', top:'15px', border:'none', background:'none', cursor:'pointer'}}><X size={20}/></button>
                            <h3>Edit Product ✏️</h3>
                            <form onSubmit={handleUpdateSubmit}>
                                <label>Name</label>
                                <input className="input-field" value={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} required />
                                <label>Price</label>
                                <input className="input-field" type="number" value={editForm.price} onChange={e=>setEditForm({...editForm, price:e.target.value})} required />
                                <label>Description</label>
                                <textarea className="input-field" value={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} required />
                                <label>Update File (Optional)</label>
                                <input type="file" onChange={e => setEditForm({...editForm, file: e.target.files[0]})} style={{marginBottom:'15px'}}/>
                                <button disabled={updating} className="btn-primary" style={{width:'100%', justifyContent:'center'}}>
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {/* 👆 POPUP END 👆 */}

                {loading ? <p>Loading products...</p> : products.length === 0 ? (
                    <div className="glass-card"><p>No products yet.</p></div>
                ) : (
                    <div className="stats-grid" style={{marginTop:'20px'}}>
                        {products.map(p => (
                            <div key={p._id} className="glass-card">
                                <h4 style={{margin:'0 0 10px 0', fontSize:'18px'}}>{p.title}</h4>
                                <p style={{color:'#64748b', fontSize:'14px', marginBottom:'15px'}}>{p.description ? p.description.substring(0, 50) + '...' : 'No description'}</p>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <span style={{color:'#4f46e5', fontWeight:'bold', fontSize:'16px'}}>₹{p.price}</span>
                                    <div style={{display:'flex', gap:'8px'}}>
                                        <button onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/buy/${p._id}`); alert("Link Copied!");}} style={{background:'#e0e7ff', color:'#4f46e5', border:'none', padding:'8px', borderRadius:'8px', cursor:'pointer'}}><ExternalLink size={16}/></button>
                                        
                                        {/* ✅ EDIT BUTTON working now */}
                                        <button onClick={() => handleEditClick(p)} style={{background:'#f3e8ff', color:'#7e22ce', border:'none', padding:'8px', borderRadius:'8px', cursor:'pointer'}}><Edit size={16}/></button>
                                        
                                        <button onClick={() => handleDelete(p._id)} style={{background:'#fee2e2', color:'#ef4444', border:'none', padding:'8px', borderRadius:'8px', cursor:'pointer'}}><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Products;