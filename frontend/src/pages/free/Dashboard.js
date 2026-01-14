import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, TrendingUp, ShoppingBag, PlusCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ revenue: 0, productCount: 0, totalSales: 0, sellerName: 'Loading...' });
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState("Waiting..."); // Debug status on screen

    const REVENUE_LIMIT = 3000;
    const isLimitReached = stats.revenue >= REVENUE_LIMIT;

    const fetchStats = useCallback(async () => {
        console.log("🟢 1. Fetch Stats Started...");
        setDebugInfo("Fetching...");

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("🔴 No Token Found!");
            setDebugInfo("Error: No Token");
            return navigate('/free/login');
        }
        
        try {
            // Anti-cache URL
            const url = `http://localhost:5000/api/free/dashboard/stats?t=${Date.now()}`;
            console.log("🟡 2. Requesting URL:", url);

            const res = await axios.get(url, { 
                headers: { 'x-auth-token': token } 
            });
            
            console.log("🟢 3. Backend Response RAW:", res);
            console.log("🟢 4. Data Received:", res.data);
            
            // Screen par dikhane ke liye debug string banayi
            setDebugInfo(`Success! Server Sent: Revenue=${res.data.revenue}, Sales=${res.data.totalSales}`);

            // Agar backend data bhej raha hai par key alag hai to yahan pakda jayega
            if (res.data.revenue === undefined) {
                console.warn("⚠️ WARNING: 'revenue' key missing in response!", res.data);
                setDebugInfo("Error: Missing 'revenue' key in backend data");
            }

            setStats(res.data);
            setLoading(false);

        } catch (err) { 
            console.error("🔴 Dashboard API Error:", err);
            setDebugInfo(`API Error: ${err.message}`);
            if(err.response?.status === 401) navigate('/free/login');
        }
    }, [navigate]);

    // Initial Load
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Auto-Refresh Logic
    useEffect(() => {
        const handleFocus = () => {
            console.log("👀 Tab Focused - Refreshing...");
            fetchStats();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchStats]);

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}><h3>Loading... Check Console (F12)</h3></div>;

    const revenuePercent = Math.min((stats.revenue / REVENUE_LIMIT) * 100, 100);

    return (
        <div className="dashboard-container">
            {/* --- 🛑 DEBUG BOX (REMOVE LATER) --- */}
            <div style={{
                position: 'fixed', bottom: '10px', right: '10px', 
                background: '#000', color: '#0f0', padding: '15px', 
                borderRadius: '8px', zIndex: 9999, fontSize: '12px', 
                maxWidth: '300px', border: '2px solid red', fontFamily: 'monospace'
            }}>
                <strong>🛠️ DEBUG MODE ACTIVE</strong><br/>
                Status: {debugInfo}<br/>
                Current State: Rev: {stats.revenue} | Sales: {stats.totalSales}
            </div>
            {/* ------------------------------------- */}

            <aside className="sidebar">
                <div className="sidebar-logo">bititap</div>
                <nav style={{display:'flex', width:'100%', flexDirection:'inherit', justifyContent:'inherit', gap:'inherit'}}>
                    <Link to="/free/dashboard" className="nav-item active"><LayoutDashboard size={20}/> <span>Overview</span></Link>
                    <Link to="/free/products" className="nav-item"><Package size={20}/> <span>Products</span></Link>
                    <Link to="/free/orders" className="nav-item"><ShoppingCart size={20}/> <span>Sales</span></Link>
                    <Link to="/free/settings" className="nav-item"><Settings size={20}/> <span>Settings</span></Link>
                </nav>
            </aside>

            <main className="main-content">
                <div className="top-header">
                    <div>
                        <h1 className="welcome-text">Hello, {stats.sellerName} 👋</h1>
                        <p className="sub-text">Your business at a glance</p>
                    </div>
                    {!isLimitReached && (
                        <Link to="/free/add-product" className="btn-primary"><PlusCircle size={18}/> Add Product</Link>
                    )}
                </div>

                <div className="glass-card">
                    <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold'}}>
                        <span>Free Plan Limit</span>
                        <span style={{color: isLimitReached ? 'red' : '#4f46e5'}}>₹{stats.revenue} / ₹{REVENUE_LIMIT}</span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{width: `${revenuePercent}%`, background: isLimitReached ? '#ef4444' : '#4f46e5'}}></div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-box blue"><TrendingUp size={24}/></div>
                        <div><span style={{fontSize:'12px', color:'#64748b'}}>Earnings</span><h3>₹{stats.revenue}</h3></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-box green"><ShoppingBag size={24}/></div>
                        <div><span style={{fontSize:'12px', color:'#64748b'}}>Sales</span><h3>{stats.totalSales}</h3></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-box purple"><Package size={24}/></div>
                        <div><span style={{fontSize:'12px', color:'#64748b'}}>Products</span><h3>{stats.productCount} / 15</h3></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;