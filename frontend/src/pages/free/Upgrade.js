import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, Zap, CheckCircle, Shield, Star, Crown } from 'lucide-react';
import './Dashboard.css'; 

const Upgrade = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            {/* 🟢 SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-logo">bititap</div>
                <nav style={{display:'flex', width:'100%', flexDirection:'inherit', justifyContent:'inherit', gap:'inherit'}}>
                    <Link to="/free/dashboard" className="nav-item"><LayoutDashboard size={20}/> <span>Overview</span></Link>
                    <Link to="/free/products" className="nav-item"><Package size={20}/> <span>Products</span></Link>
                    <Link to="/free/orders" className="nav-item"><ShoppingCart size={20}/> <span>Sales</span></Link>
                    <Link to="/free/settings" className="nav-item"><Settings size={20}/> <span>Settings</span></Link>
                    <Link to="/free/upgrade" className="nav-item active" style={{color: '#d97706'}}>
                        <Zap size={20}/> <span>Upgrade Plan</span>
                    </Link>
                </nav>
            </aside>

            {/* 🟢 MAIN CONTENT */}
            <main className="main-content">
                <div className="top-header">
                    <div>
                        <h1 className="welcome-text">Upgrade Your Limits 🚀</h1>
                        <p className="sub-text">Unlock higher revenue limits & premium features.</p>
                    </div>
                </div>

                {/* ✨ Container Center me kar diya hai taaki 2 cards acche dikhe */}
                <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '40px', alignItems: 'flex-start', justifyContent: 'center'}}>
                    
                    {/* ❌ Free Plan Hata Diya */}

                    {/* 1️⃣ SILVER PLAN (Monthly) */}
                    <div style={{flex: '0 1 350px', background: '#fff', padding: '30px', borderRadius: '15px', border: '2px solid #3b82f6', position: 'relative', transform: 'scale(1.02)', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)'}}>
                        <div style={{position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>RECOMMENDED</div>
                        
                        <h3 style={{fontSize: '20px', color: '#1e3a8a', display:'flex', alignItems:'center', gap:'8px', justifyContent:'center'}}><Star size={20} fill="#3b82f6" stroke="#1e3a8a"/> Silver</h3>
                        <div style={{fontSize: '42px', fontWeight: 'bold', margin: '15px 0', color: '#0f172a', textAlign:'center'}}>₹599<span style={{fontSize: '16px', fontWeight: 'normal', color: '#64748b'}}>/mo</span></div>
                        
                        <div style={{background: '#eff6ff', color:'#1e40af', padding:'8px', borderRadius:'6px', fontSize:'13px', fontWeight:'bold', textAlign:'center', marginBottom:'20px'}}>
                             🚀 0% Commission
                        </div>
                        
                        <ul style={{listStyle: 'none', padding: 0, color: '#334155', lineHeight: '2.5', fontSize: '14px'}}>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><CheckCircle size={18} color="#2563eb"/> <strong>Unlimited Revenue</strong></li>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><CheckCircle size={18} color="#2563eb"/> Products: <strong>50</strong></li>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><CheckCircle size={18} color="#2563eb"/> <strong>Auto-Approve Orders</strong></li>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><CheckCircle size={18} color="#2563eb"/> Priority Email Support</li>
                        </ul>
                        <button onClick={()=> alert('Gateway Integration Pending!')} style={{width: '100%', padding: '14px', marginTop: '25px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', fontSize:'16px'}}>Start Silver</button>
                    </div>

                    {/* 2️⃣ GOLD PLAN (Yearly) */}
                    <div style={{flex: '0 1 350px', background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)', padding: '30px', borderRadius: '15px', color: 'white', position: 'relative', boxShadow: '0 20px 25px -5px rgba(180, 83, 9, 0.4)'}}>
                        <div style={{position: 'absolute', top: '-12px', right: '20px', background: '#fff', color: '#b45309', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.2)'}}>BEST VALUE</div>
                        
                        <h3 style={{fontSize: '20px', display:'flex', alignItems:'center', gap:'8px', justifyContent:'center'}}><Crown size={20} fill="#fcd34d"/> Gold</h3>
                        <div style={{fontSize: '42px', fontWeight: 'bold', margin: '15px 0', textAlign:'center'}}>₹3,999<span style={{fontSize: '16px', fontWeight: 'normal', opacity: 0.9}}>/yr</span></div>
                        
                        <div style={{background: 'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', padding:'8px', borderRadius:'6px', fontSize:'13px', fontWeight:'bold', textAlign:'center', marginBottom:'20px'}}>
                             👑 0% Commission + Unlimited
                        </div>
                        
                        <ul style={{listStyle: 'none', padding: 0, lineHeight: '2.5', fontSize: '14px'}}>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><Shield size={18}/> <strong>Unlimited Revenue</strong></li>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><Shield size={18}/> <strong>Unlimited Products</strong></li>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><Shield size={18}/> <strong>Auto-Approve Orders</strong></li>
                            <li style={{display:'flex', alignItems:'center', gap:'10px'}}><Shield size={18}/> WhatsApp Priority Support</li>
                        </ul>
                        <button onClick={()=> alert('Gateway Integration Pending!')} style={{width: '100%', padding: '14px', marginTop: '25px', borderRadius: '10px', border: 'none', background: '#fff', color: '#78350f', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize:'16px'}}>Get Gold Access</button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Upgrade;