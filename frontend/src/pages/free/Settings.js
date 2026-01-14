import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// ✅ Zap Icon add kiya (Upgrade Tab ke liye)
import { LayoutDashboard, Package, ShoppingCart, Settings, Save, LogOut, UploadCloud, RefreshCw, Zap } from 'lucide-react';
import './Dashboard.css';

const SettingsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // States
    const [form, setForm] = useState({ upiId: '', autoApprove: false });
    const [currentQrUrl, setCurrentQrUrl] = useState(''); // Database wala QR
    const [qrFile, setQrFile] = useState(null); // Nayi file upload ke liye
    const [previewUrl, setPreviewUrl] = useState(null); // Live Preview ke liye
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 1. Fetch Existing Settings
    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/free/login');

            try {
                // ✅ Backend GET Route: /api/free/settings
                const res = await axios.get('http://localhost:5000/api/free/settings', { 
                    headers: { 'x-auth-token': token } 
                });
                
                setForm({
                    upiId: res.data.upiId || '',
                    autoApprove: res.data.autoApprove || false
                });

                // Agar pehle se QR hai to set karo
                if(res.data.qrCodeUrl) {
                    setCurrentQrUrl(res.data.qrCodeUrl); 
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching settings:", err);
                if(err.response?.status === 401) navigate('/free/login');
                setLoading(false);
            }
        };
        fetchSettings();
    }, [navigate]);

    // 🔄 LIVE PREVIEW LOGIC
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrFile(file);
            // Browser memory me temporary link banao taaki user turant dekh sake
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    // 💾 UPDATE FUNCTION
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('upiId', form.upiId);
        formData.append('autoApprove', form.autoApprove); // Backend string me convert kar lega
        
        // ✅ Backend 'qrCode' maang raha hai
        if(qrFile) {
            formData.append('qrCode', qrFile); 
        }

        try {
            // ✅ Backend PUT Route: /api/free/settings/update
            const res = await axios.put('http://localhost:5000/api/free/settings/update', formData, { 
                headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } 
            });
            
            alert(res.data.message || "Settings Updated Successfully! ✅");
            
            // Update hone ke baad Live View ko Permanent View bana do
            if(res.data.settings?.qrCodeUrl) {
                setCurrentQrUrl(res.data.settings.qrCodeUrl);
                setPreviewUrl(null); // Preview hata do
                setQrFile(null); // Input khali kar do
            }
        } catch(err) { 
            console.error(err);
            alert(err.response?.data?.message || "Error saving settings"); 
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('token');
            navigate('/free/login');
        }
    };

    // Logic: Kaunsa QR dikhana hai? (Pehle Preview, fir Saved, fir Empty)
    const displayQr = previewUrl ? previewUrl : currentQrUrl;

    return (
        <div className="dashboard-container">
            {/* 🟢 SIDEBAR (Upgrade Tab Added) */}
            <aside className="sidebar">
                <div className="sidebar-logo">bititap</div>
                <nav style={{display:'flex', width:'100%', flexDirection:'inherit', justifyContent:'inherit', gap:'inherit'}}>
                    <Link to="/free/dashboard" className={`nav-item ${location.pathname === '/free/dashboard' ? 'active' : ''}`}><LayoutDashboard size={20}/> <span>Overview</span></Link>
                    <Link to="/free/products" className={`nav-item ${location.pathname === '/free/products' ? 'active' : ''}`}><Package size={20}/> <span>Products</span></Link>
                    <Link to="/free/orders" className={`nav-item ${location.pathname === '/free/orders' ? 'active' : ''}`}><ShoppingCart size={20}/> <span>Sales</span></Link>
                    <Link to="/free/settings" className={`nav-item ${location.pathname === '/free/settings' ? 'active' : ''}`}><Settings size={20}/> <span>Settings</span></Link>
                    <Link to="/free/upgrade" className="nav-item" style={{color: '#d97706'}}>
                        <Zap size={20}/> <span>Upgrade Plan</span>
                    </Link>
                </nav>
            </aside>

            <main className="main-content">
                <div className="top-header">
                    <div>
                        <h1 className="welcome-text">Settings ⚙️</h1>
                        <p className="sub-text">Configure your payment & store preferences.</p>
                    </div>
                </div>
                
                {loading ? <p style={{padding:'20px'}}>Loading settings...</p> : (
                    <div className="glass-card" style={{maxWidth:'600px', marginTop:'20px'}}>
                        <form onSubmit={handleUpdate}>
                            
                            {/* UPI ID INPUT */}
                            <label style={{fontWeight:'bold', display:'block', marginBottom:'8px'}}>UPI ID</label>
                            <input className="input-field" value={form.upiId} 
                                onChange={e=>setForm({...form, upiId:e.target.value})} 
                                placeholder="e.g. yourname@okaxis" 
                            />
                            
                            {/* QR CODE SECTION (With Preview) */}
                            <label style={{fontWeight:'bold', display:'block', marginTop:'20px', marginBottom:'10px'}}>Payment QR Code</label>
                            
                            <div style={{display:'flex', gap:'20px', alignItems:'flex-start', background:'#f8fafc', padding:'15px', borderRadius:'10px', border:'1px dashed #cbd5e1'}}>
                                {/* Preview Box */}
                                <div style={{width:'120px', height:'120px', background:'#fff', borderRadius:'10px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                                    {displayQr ? (
                                        <img src={displayQr} alt="QR Preview" style={{width:'100%', height:'100%', objectFit:'contain'}} />
                                    ) : (
                                        <span style={{fontSize:'12px', color:'#94a3b8'}}>No QR Set</span>
                                    )}
                                </div>

                                {/* Upload Controls */}
                                <div style={{flex:1}}>
                                    <p style={{fontSize:'14px', color:'#64748b', marginBottom:'10px'}}>Buyers will scan this to pay.</p>
                                    
                                    <input type="file" id="qrInput" onChange={handleFileChange} style={{display:'none'}} accept="image/*"/>
                                    
                                    <label htmlFor="qrInput" style={{
                                        display:'inline-flex', alignItems:'center', gap:'8px',
                                        background: currentQrUrl ? '#f3e8ff' : '#e0e7ff', 
                                        color: currentQrUrl ? '#7e22ce' : '#4f46e5',
                                        padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'14px'
                                    }}>
                                        {currentQrUrl ? <><RefreshCw size={16}/> Change QR Code</> : <><UploadCloud size={16}/> Upload QR Code</>}
                                    </label>
                                    
                                    {previewUrl && <p style={{fontSize:'12px', color:'#16a34a', marginTop:'5px'}}>New QR selected! Click Save to apply.</p>}
                                </div>
                            </div>

                            {/* AUTO APPROVE TOGGLE */}
                            <div style={{marginTop:'20px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
                                <input type="checkbox" id="autoApprove" style={{width:'18px', height:'18px'}}
                                    checked={form.autoApprove} 
                                    onChange={e=>setForm({...form, autoApprove:e.target.checked})}
                                />
                                <label htmlFor="autoApprove" style={{fontWeight:'bold', cursor:'pointer', color:'#333'}}>Enable Auto-Approve (Risky)</label>
                            </div>

                            {/* SAVE BUTTON */}
                            <button disabled={saving} className="btn-primary" style={{width:'100%', justifyContent:'center', gap:'10px', height:'45px'}}>
                                <Save size={18}/> {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </form>

                        <div style={{marginTop:'20px', textAlign:'right'}}>
                            <button onClick={handleLogout} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px', marginLeft:'auto'}}>
                                <LogOut size={16}/> Log Out
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SettingsPage;