import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const CheckoutSilver = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Pay, 2: Processing, 3: Redirect
    const [utr, setUtr] = useState('');
    
    // 👇 YAHAN APNA QR CODE LINK DAAL
    const ADMIN_QR = "https://via.placeholder.com/250?text=Scan+to+Pay+₹599"; 
    const ADMIN_UPI = "yourname@oksbi"; // Apni UPI ID
    const AMOUNT = 599;

    // Payment Hone ke baad ka Logic
    const handlePaymentComplete = () => {
        if(!utr || utr.length < 4) return alert("Please enter valid UTR / Ref ID");
        
        setStep(2); // Show Loading (Google Pay style animation)

        setTimeout(() => {
            // Data Save for Signup Page
            localStorage.setItem('pendingSubscription', JSON.stringify({
                plan: 'silver',
                amount: AMOUNT,
                utr: utr,
                date: Date.now()
            }));

            setStep(3); // Show Success
            
            // 🚀 AUTOMATIC REDIRECT
            setTimeout(() => {
                navigate('/silver/signup');
            }, 2000); // 2 second baad redirect
        }, 2000);
    };

    return (
        <div style={{minHeight:'100vh', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Inter', sans-serif"}}>
            
            <div style={{background:'white', width:'100%', maxWidth:'450px', borderRadius:'24px', boxShadow:'0 10px 40px -10px rgba(0,0,0,0.1)', overflow:'hidden', border:'1px solid #e2e8f0'}}>
                
                {/* HEADER (GPay Style) */}
                <div style={{background:'#2563eb', color:'white', padding:'30px 20px', textAlign:'center'}}>
                    <div style={{fontSize:'12px', opacity:0.8, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'5px'}}>PAYING TO BITITAP</div>
                    <div style={{fontSize:'32px', fontWeight:'bold'}}>₹{AMOUNT}</div>
                    <div style={{fontSize:'14px', marginTop:'5px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                        <ShieldCheck size={16}/> Silver Plan Subscription
                    </div>
                </div>

                <div style={{padding:'30px'}}>
                    
                    {/* STEP 1: SCAN & PAY */}
                    {step === 1 && (
                        <>
                            <div style={{textAlign:'center', marginBottom:'25px'}}>
                                <div style={{border:'2px dashed #cbd5e1', padding:'10px', borderRadius:'15px', display:'inline-block'}}>
                                    <img src={ADMIN_QR} alt="QR Code" style={{width:'180px', height:'180px', objectFit:'contain'}} />
                                </div>
                                <p style={{fontSize:'13px', color:'#64748b', marginTop:'10px'}}>Scan using any UPI App</p>
                                
                                <div style={{background:'#f1f5f9', padding:'8px 15px', borderRadius:'20px', display:'inline-block', fontSize:'14px', fontWeight:'bold', marginTop:'5px', color:'#334155'}}>
                                    {ADMIN_UPI}
                                </div>
                            </div>

                            <div style={{marginBottom:'20px'}}>
                                <label style={{fontSize:'12px', fontWeight:'bold', color:'#64748b', display:'block', marginBottom:'5px'}}>ENTER UTR / REFERENCE NO.</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: 345123..." 
                                    value={utr}
                                    onChange={(e)=>setUtr(e.target.value)}
                                    style={{width:'100%', padding:'14px', borderRadius:'12px', border:'1px solid #cbd5e1', fontSize:'16px', outline:'none', fontWeight:'bold', color:'#334155'}}
                                />
                            </div>

                            <button onClick={handlePaymentComplete} style={{width:'100%', padding:'16px', background:'#000', color:'white', borderRadius:'12px', border:'none', fontSize:'16px', fontWeight:'bold', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px'}}>
                                Verify & Proceed <ArrowRight size={18}/>
                            </button>

                            <a href={`upi://pay?pa=${ADMIN_UPI}&pn=Bititap&am=${AMOUNT}&cu=INR`} style={{display:'block', textAlign:'center', marginTop:'15px', color:'#2563eb', fontWeight:'bold', textDecoration:'none', fontSize:'14px'}}>
                                Open UPI App Directly
                            </a>
                        </>
                    )}

                    {/* STEP 2: PROCESSING (Animation) */}
                    {step === 2 && (
                        <div style={{textAlign:'center', padding:'40px 0'}}>
                            <div className="spin" style={{margin:'0 auto 20px'}}><Loader2 size={48} color="#2563eb"/></div>
                            <h3 style={{margin:0}}>Verifying Payment...</h3>
                            <p style={{color:'#64748b', fontSize:'14px'}}>Please wait while we confirm.</p>
                        </div>
                    )}

                    {/* STEP 3: SUCCESS (Auto Redirect) */}
                    {step === 3 && (
                        <div style={{textAlign:'center', padding:'40px 0'}}>
                            <div style={{width:'60px', height:'60px', background:'#dcfce7', color:'#16a34a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
                                <CheckCircle size={32}/>
                            </div>
                            <h3 style={{margin:0, color:'#166534'}}>Payment Successful!</h3>
                            <p style={{color:'#64748b', fontSize:'14px', marginTop:'5px'}}>Redirecting to Signup...</p>
                        </div>
                    )}

                </div>
            </div>

            {/* SPINNER ANIMATION CSS */}
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default CheckoutSilver;