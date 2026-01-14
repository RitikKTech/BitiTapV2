import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, CheckCircle, Clock, Download } from 'lucide-react'; 

const ProductPublic = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form Data
    const [form, setForm] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '', utr: '' });
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false); 

    // ✅ TRACKING STATE (Declared Here - No more 'undefined' errors)
    const [orderId, setOrderId] = useState(null);
    const [orderStatus, setOrderStatus] = useState('initial'); 
    const [downloadLink, setDownloadLink] = useState(null);

    // Helper: URL Fixer
    const getUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `http://localhost:5000/${url}`;
    };

    // 1. Fetch Product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/free/products/public/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Product unavailable.");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // 2. Handle Buy (Order Place)
    const handleBuy = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post('http://localhost:5000/api/free/orders/place', { productId: id, ...form });
            
            // ✅ Save Order ID & Status (Crucial for polling)
            setOrderId(res.data.orderId);
            setOrderStatus(res.data.status);
            
            if (res.data.status === 'approved') {
                setDownloadLink(res.data.downloadLink); 
            }
            
            setOrderSuccess(true);
        } catch (err) {
            alert("Error placing order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // 3. ⚡ AUTO-REFRESH LOGIC (Polished & Error Free) ⚡
    useEffect(() => {
        let interval;
        
        // Only run if we have an Order ID and status is pending
        if (orderSuccess && orderId && orderStatus === 'pending') {
            
            interval = setInterval(async () => {
                try {
                    console.log("Checking approval status...");
                    // ?t=... ensures fresh data from server (anti-cache)
                    const res = await axios.get(`http://localhost:5000/api/free/orders/${orderId}?t=${Date.now()}`);
                    
                    // If Approved
                    if (res.data.status === 'approved') {
                        setOrderStatus('approved');
                        
                        // ✅ Link Capture Logic
                        if (res.data.productLink) {
                            setDownloadLink(res.data.productLink);
                        }
                        
                        clearInterval(interval); // Stop checking
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 3000); // Check every 3 seconds
        }
        return () => clearInterval(interval);
    }, [orderSuccess, orderId, orderStatus]);

    // --- STYLES ---
    const styles = {
        container: { minHeight: '100vh', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" },
        card: { background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '20px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e5e7eb' },
        header: { background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', padding: '30px 20px', color: 'white', textAlign: 'center' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
        input: { width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
        qrBox: { background: '#f9fafb', border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '25px' }
    };

    if (loading) return <div style={styles.container}>Loading Product...</div>;
    if (error) return <div style={{...styles.container, color:'red'}}>{error}</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={{margin: '0 0 5px 0', fontSize:'24px', fontWeight:'700'}}>{product.title}</h2>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', opacity:0.9, fontSize:'14px'}}>
                        <ShieldCheck size={16}/> 
                        <span>Sold by {product.seller?.name || "Verified Seller"}</span>
                    </div>
                    <div style={{marginTop:'20px', background:'rgba(255,255,255,0.2)', display:'inline-block', padding:'8px 20px', borderRadius:'30px', fontWeight:'bold', fontSize:'24px', backdropFilter:'blur(5px)'}}>
                        ₹{product.price}
                    </div>
                </div>

                <div style={{padding: '30px'}}>
                    {!orderSuccess ? (
                        /* --- FORM VIEW --- */
                        <>
                            <div style={styles.qrBox}>
                                <p style={{fontSize:'12px', color:'#6b7280', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'15px'}}>Step 1: Scan QR to Pay</p>
                                {product.seller?.qrCodeUrl ? (
                                    <div style={{background:'white', padding:'10px', borderRadius:'10px', display:'inline-block', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)'}}>
                                        <img src={getUrl(product.seller.qrCodeUrl)} alt="QR Code" style={{width:'160px', height:'160px', objectFit:'contain'}} />
                                    </div>
                                ) : (
                                    <div style={{padding:'20px', color:'#9ca3af', fontSize:'14px'}}>No QR Code Available</div>
                                )}
                                <div style={{marginTop:'15px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'#374151', fontSize:'14px'}}>
                                    <span style={{color:'#6b7280'}}>UPI ID:</span>
                                    <strong style={{background:'#eef2ff', padding:'4px 8px', borderRadius:'4px', color:'#4f46e5', userSelect:'all'}}>{product.seller?.upiId || "N/A"}</strong>
                                </div>
                            </div>

                            <form onSubmit={handleBuy}>
                                <p style={{fontSize:'12px', color:'#6b7280', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'15px'}}>Step 2: Enter Details</p>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Full Name</label>
                                    <input required style={styles.input} placeholder="Enter your name"
                                        value={form.buyerName} onChange={e=>setForm({...form, buyerName:e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Email Address</label>
                                    <input required type="email" style={styles.input} placeholder="name@email.com"
                                        value={form.buyerEmail} onChange={e=>setForm({...form, buyerEmail:e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Phone</label>
                                    <input required type="tel" style={styles.input} placeholder="98765.."
                                        value={form.buyerPhone} onChange={e=>setForm({...form, buyerPhone:e.target.value})} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={{...styles.label, color:'#dc2626'}}>Transaction ID / UTR (Required)</label>
                                    <input required style={{...styles.input, borderColor:'#fca5a5', background:'#fef2f2', color:'#b91c1c', fontWeight:'600'}} 
                                        placeholder="Ex: 345678123456"
                                        value={form.utr} onChange={e=>setForm({...form, utr:e.target.value})} />
                                </div>
                                <button disabled={submitting} style={{
                                    width:'100%', padding:'16px', background:'#111827', color:'white', border:'none', 
                                    borderRadius:'12px', fontSize:'16px', fontWeight:'600', cursor:'pointer',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'10px'
                                }}>
                                    {submitting ? 'Processing...' : <><Lock size={18}/> Confirm Payment & Get Access</>}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* --- STATUS VIEW --- */
                        <div style={{textAlign:'center', padding:'40px 10px'}}>
                            
                            {/* APPROVED */}
                            {orderStatus === 'approved' ? (
                                <>
                                    <div style={{width:'80px', height:'80px', background:'#dcfce7', color:'#16a34a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 style={{fontSize:'22px', marginBottom:'10px', color:'#166534'}}>Payment Verified! 🎉</h3>
                                    <p style={{color:'#6b7280', marginBottom:'20px'}}>Thank you, <strong>{form.buyerName}</strong>. Your file is ready.</p>
                                    
                                    <a href={getUrl(downloadLink)} target="_blank" rel="noopener noreferrer"
                                       style={{
                                           display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                                           background:'#2563eb', color:'white', padding:'15px 30px', borderRadius:'12px',
                                           textDecoration:'none', fontWeight:'bold', fontSize:'18px', boxShadow:'0 4px 10px rgba(37, 99, 235, 0.3)'
                                       }}>
                                        <Download size={20}/> Download Now
                                    </a>
                                </>
                            ) : (
                                /* PENDING */
                                <>
                                    <div className="animate-pulse" style={{width:'80px', height:'80px', background:'#fef3c7', color:'#d97706', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
                                        <Clock size={40} />
                                    </div>
                                    <h3 style={{fontSize:'22px', marginBottom:'10px', color:'#92400e'}}>Verifying Payment...</h3>
                                    <p style={{color:'#6b7280', lineHeight:'1.6', fontSize:'15px'}}>
                                        Please wait. Seller is checking UTR: <br/>
                                        <strong style={{fontFamily:'monospace', background:'#f3f4f6', padding:'2px 6px', borderRadius:'4px'}}>{form.utr}</strong>
                                    </p>
                                    
                                    <div style={{marginTop:'30px', padding:'15px', background:'#f9fafb', borderRadius:'10px', border:'1px solid #e5e7eb'}}>
                                        <div style={{height:'4px', width:'100%', background:'#e5e7eb', borderRadius:'2px', overflow:'hidden'}}>
                                            <div style={{height:'100%', width:'60%', background:'#3b82f6'}} className="loading-bar"></div>
                                        </div>
                                        <p style={{fontSize:'12px', color:'#6b7280', marginTop:'10px'}}>
                                            Do not close this window.<br/>Checking status automatically...
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{background:'#f9fafb', padding:'15px', textAlign:'center', borderTop:'1px solid #e5e7eb', fontSize:'12px', color:'#9ca3af', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                    <ShieldCheck size={14}/> Secured by Bititap Payments
                </div>
            </div>

            <style>{`
                @keyframes load { 0% { width: 0; } 50% { width: 70%; } 100% { width: 100%; } }
                .loading-bar { animation: load 2s infinite ease-in-out; }
            `}</style>
        </div>
    );
};

export default ProductPublic;