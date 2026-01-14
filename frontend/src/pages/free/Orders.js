import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
// ✅ Zap Icon add kiya
import { LayoutDashboard, Package, ShoppingCart, Settings, CheckCircle, XCircle, Clock, Bell, Zap } from 'lucide-react';
import './Dashboard.css';

// 🔔 SOUND URL (Simple Beep if you don't have file)
const BELL_SOUND = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

const Orders = () => {
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Sound Player Ref
    const audioRef = useRef(new Audio(BELL_SOUND));
    const previousPendingCount = useRef(0);

    // 1. Fetch Orders & Check for New Ones
    const fetchOrders = async (playAudio = false) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/free/orders', { 
                headers: { 'x-auth-token': token } 
            });
            
            const data = res.data;
            setOrders(data);
            setLoading(false);

            // 🔔 SOUND LOGIC: Check agar naya Pending order aaya hai
            const currentPending = data.filter(o => o.status === 'pending').length;
            if (playAudio && currentPending > previousPendingCount.current) {
                audioRef.current.play().catch(e => console.log("Audio play failed interaction required"));
            }
            previousPendingCount.current = currentPending;

        } catch (err) { console.error("Error fetching orders:", err); }
    };

    // Auto-Refresh Orders every 5 Seconds (Real-time feel)
    useEffect(() => {
        fetchOrders(false); // First load
        const interval = setInterval(() => {
            fetchOrders(true); // Check updates + Play Sound
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 2. Approve Order
    const handleApprove = async (id) => {
        if(!window.confirm("Approve Order? Revenue will generate & Buyer gets link.")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/free/orders/${id}/approve`, {}, {
                headers: { 'x-auth-token': token }
            });
            alert("Order Accepted! ✅ Sales +1");
            fetchOrders(false); // Refresh list immediately
        } catch (err) { alert("Error approving"); }
    };

    // 3. Reject Order
    const handleReject = async (id) => {
        if(!window.confirm("Reject this order?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/free/orders/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchOrders(false);
        } catch (err) { alert("Error deleting"); }
    };

    return (
        <div className="dashboard-container">
            {/* 🟢 SIDEBAR FIXED (Added Upgrade Tab) */}
            <aside className="sidebar">
                <div className="sidebar-logo">bititap</div>
                <nav style={{display:'flex', width:'100%', flexDirection:'inherit', justifyContent:'inherit', gap:'inherit'}}>
                    <Link to="/free/dashboard" className="nav-item"><LayoutDashboard size={20}/> <span>Overview</span></Link>
                    <Link to="/free/products" className="nav-item"><Package size={20}/> <span>Products</span></Link>
                    <Link to="/free/orders" className="nav-item active"><ShoppingCart size={20}/> <span>Sales</span></Link>
                    <Link to="/free/settings" className="nav-item"><Settings size={20}/> <span>Settings</span></Link>
                    {/* ✅ New Upgrade Tab */}
                    <Link to="/free/upgrade" className="nav-item" style={{color: '#d97706'}}>
                        <Zap size={20}/> <span>Upgrade Plan</span>
                    </Link>
                </nav>
            </aside>

            <main className="main-content">
                <h2 className="welcome-text">Sales & Orders 💸</h2>
                
                {/* Manual Refresh Button */}
                <button onClick={() => fetchOrders(false)} style={{marginBottom:'20px', padding:'10px', cursor:'pointer'}}>
                    🔄 Refresh List
                </button>

                {loading ? <p>Loading...</p> : (
                    <div className="glass-card" style={{padding:0, overflow:'hidden'}}>
                        <table className="orders-table" style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead>
                                <tr style={{background:'#f9fafb', borderBottom:'2px solid #e5e7eb'}}>
                                    <th style={{padding:'12px', textAlign:'left'}}>Buyer</th>
                                    <th style={{padding:'12px', textAlign:'left'}}>UTR</th>
                                    <th style={{padding:'12px', textAlign:'left'}}>Amount</th>
                                    <th style={{padding:'12px', textAlign:'left'}}>Status</th>
                                    <th style={{padding:'12px', textAlign:'left'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} style={{borderBottom:'1px solid #f3f4f6'}}>
                                        <td style={{padding:'15px'}}>
                                            <strong>{order.buyerName}</strong><br/>
                                            <span style={{fontSize:'12px', color:'#666'}}>{order.buyerEmail}</span>
                                        </td>
                                        <td style={{padding:'15px'}}><span style={{background:'#f3f4f6', padding:'5px'}}>{order.utr}</span></td>
                                        <td style={{padding:'15px', color:'green', fontWeight:'bold'}}>₹{order.productPrice}</td>
                                        
                                        {/* STATUS BADGE */}
                                        <td style={{padding:'15px'}}>
                                            {order.status === 'approved' ? (
                                                <span style={{background:'#dcfce7', color:'#166534', padding:'5px 10px', borderRadius:'15px', fontWeight:'bold', display:'flex', alignItems:'center', width:'fit-content', gap:'5px'}}>
                                                    <CheckCircle size={14}/> Accepted
                                                </span>
                                            ) : (
                                                <span style={{background:'#fef3c7', color:'#92400e', padding:'5px 10px', borderRadius:'15px', fontWeight:'bold', display:'flex', alignItems:'center', width:'fit-content', gap:'5px'}}>
                                                    <Clock size={14}/> Pending
                                                </span>
                                            )}
                                        </td>

                                        {/* ACTION BUTTONS */}
                                        <td style={{padding:'15px'}}>
                                            {order.status !== 'approved' && (
                                                <button onClick={() => handleApprove(order._id)} style={{background:'#4f46e5', color:'white', border:'none', padding:'8px 15px', borderRadius:'6px', cursor:'pointer', marginRight:'10px'}}>
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => handleReject(order._id)} style={{background:'#fee2e2', color:'#ef4444', border:'none', padding:'8px', borderRadius:'6px', cursor:'pointer'}}>
                                                <XCircle size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Orders;