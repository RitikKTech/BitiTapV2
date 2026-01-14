import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, ShieldCheck, Smartphone, Lock, Instagram, Twitter, Linkedin, 
  UserPlus, UploadCloud, Share2, Mail, CheckCircle, Star, Users 
} from 'lucide-react';

import './Home.css';

const Home = () => {
  const [text, setText] = useState('');
  const fullText = "Sell Digital Products In Seconds";
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeoutId;
    const type = () => {
      setText(fullText.substring(0, index));
      if (!isDeleting && index < fullText.length) {
        index++;
        timeoutId = setTimeout(type, 100);
      } else if (isDeleting && index > 0) {
        index--;
        timeoutId = setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        timeoutId = setTimeout(type, isDeleting ? 1000 : 2000);
      }
    };
    type();
    return () => clearTimeout(timeoutId);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="home-container">
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-container">
           {/* Logo Size CSS me fix ho gaya he */}
           <img src="/logo.png" alt="Bititap Logo" className="logo-img" /> 
        </div>
        <div className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div>
          <Link to="/free/login" className="btn-login">Login</Link>
          <Link to="/free/signup" className="btn-black">Start Selling</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="badge"><Zap size={16} /> No Payment Gateway Required</div>
        <h1 className="hero-title">{text}<span className="cursor">|</span></h1>
        <p className="hero-subtitle">The smartest way to sell E-books, Courses & Software via UPI. Money goes <b>directly to your bank</b>. No commissions.</p>
        <div><Link to="/free/signup" className="btn-primary-lg">Start Selling 🚀</Link></div>
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#94a3b8' }}>No credit card required • Instant Setup</p>
      </header>

      {/* PARTNERS */}
      <section style={{padding:'40px 0', background:'#f8fafc', borderTop:'1px solid #e2e8f0', textAlign:'center'}}>
        <p style={{fontSize:'12px', fontWeight:'800', letterSpacing:'1.5px', color:'#94a3b8', marginBottom:'25px', textTransform:'uppercase'}}>Receive Payments Directly Via</p>
        <div style={{display:'flex', justifyContent:'center', gap:'40px', flexWrap:'wrap', fontSize:'20px', fontWeight:'800', opacity:'0.6', filter:'grayscale(100%)'}}>
            <span>GPay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span><span>WhatsApp</span>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-container">
          <div><h3 className="stat-val">10k+</h3><p className="stat-lbl">Sellers Joined</p></div>
          <div><h3 className="stat-val" style={{color: '#2563eb'}}>₹5Cr+</h3><p className="stat-lbl">Money Processed</p></div>
          <div><h3 className="stat-val">50k+</h3><p className="stat-lbl">Products Sold</p></div>
          <div><h3 className="stat-val" style={{color: '#10b981'}}>0%</h3><p className="stat-lbl">Commission Fee</p></div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section-wrapper">
        <div className="grid-3">
            <div className="card">
                <div className="icon-box" style={{background:'#dcfce7', color:'#16a34a'}}><Zap size={24} /></div>
                <h3>Instant UPI Payments</h3>
                <p style={{color:'#64748b', marginTop:'10px'}}>Money goes directly from Buyer to Your Bank App.</p>
            </div>
            <div className="card">
                <div className="icon-box" style={{background:'#dbeafe', color:'#2563eb'}}><ShieldCheck size={24} /></div>
                <h3>Piracy Protection</h3>
                <p style={{color:'#64748b', marginTop:'10px'}}>Auto-stamp buyer details on every PDF page.</p>
            </div>
            <div className="card">
                <div className="icon-box" style={{background:'#f3e8ff', color:'#9333ea'}}><Smartphone size={24} /></div>
                <h3>Zero Commission</h3>
                <p style={{color:'#64748b', marginTop:'10px'}}>Keep 100% of what you earn. No cuts.</p>
            </div>
        </div>
      </section>

      {/* ✅ WHO IS BITITAP FOR? (Grid-4 applied here) */}
      <section style={{ background: '#0f172a', color: 'white', padding: '80px 20px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>Who is Bititap for? 🎯</h2>
                  <p style={{ color: '#94a3b8' }}>Perfect for anyone with a digital file to sell.</p>
              </div>
              
              {/* ✅ Yaha 'grid-4' use kiya hai taaki 4 card ek line me aaye */}
              <div className="grid-4">
                  {[
                    { title: "Students", icon: <Users/>, desc: "Sell notes & study material.", color: "#60a5fa" },
                    { title: "Developers", icon: <Zap/>, desc: "Sell source codes & scripts.", color: "#c084fc" },
                    { title: "Creators", icon: <Star/>, desc: "Sell ebooks & courses.", color: "#4ade80" },
                    { title: "Influencers", icon: <Smartphone/>, desc: "Monetize your audience.", color: "#f472b6" }
                  ].map((item, i) => (
                    <div key={i} className="dark-card">
                        <div style={{color: item.color, marginBottom:'15px'}}>{item.icon}</div>
                        <h3 style={{fontWeight:'bold', fontSize:'20px'}}>{item.title}</h3>
                        <p style={{color:'#94a3b8', fontSize:'14px'}}>{item.desc}</p>
                    </div>
                  ))}
              </div>
          </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section-wrapper" style={{textAlign:'center'}}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '60px' }}>How Bititap Works? 🛠️</h2>
        <div className="grid-3">
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <div className="icon-box" style={{width:'80px', height:'80px', background:'#eff6ff', color:'#2563eb', borderRadius:'50%'}}><UserPlus size={32}/></div>
                <h3 style={{fontWeight:'bold'}}>1. Seller Signup</h3>
                <p style={{color:'#64748b'}}>Create your free account.</p>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <div className="icon-box" style={{width:'80px', height:'80px', background:'#f3e8ff', color:'#9333ea', borderRadius:'50%'}}><UploadCloud size={32}/></div>
                <h3 style={{fontWeight:'bold'}}>2. Add Product</h3>
                <p style={{color:'#64748b'}}>Upload your file & set price.</p>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <div className="icon-box" style={{width:'80px', height:'80px', background:'#dcfce7', color:'#16a34a', borderRadius:'50%'}}><Share2 size={32}/></div>
                <h3 style={{fontWeight:'bold'}}>3. Share & Earn</h3>
                <p style={{color:'#64748b'}}>Get paid via UPI instantly.</p>
            </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-wrapper">
        <h2 style={{fontSize:'40px', fontWeight:'800'}}>Simple Pricing 💎</h2>
        <p style={{color:'#64748b', marginBottom:'60px'}}>Start for free. Upgrade as you grow.</p>
        
        <div className="grid-3" style={{maxWidth:'1000px', margin:'0 auto'}}>
            {/* Free */}
            <div className="price-card">
                <h3>Free Starter</h3>
                <div className="price-amount">₹0</div>
                <p style={{color:'#64748b'}}>Limit: ₹3000 Revenue</p>
                <Link to="/free/signup" className="btn-outline">Start Free</Link>
                <ul className="check-list"><li>✅ Sell up to ₹3000</li><li>✅ Direct UPI Payment</li></ul>
            </div>
            {/* Monthly */}
            <div className="price-card" style={{border:'2px solid #2563eb', background:'#eff6ff'}}>
                <h3 style={{color:'#2563eb'}}>Monthly Pro</h3>
                <div className="price-amount" style={{color:'#1e3a8a'}}>₹599<span style={{fontSize:'16px'}}>/mo</span></div>
                <p style={{color:'#64748b'}}>Remove all limits</p>
                <Link to="/payment/monthly" className="btn-filled">Get Monthly</Link>
                <ul className="check-list"><li>🔥 Unlimited Revenue</li><li>🔥 Zero Commission</li></ul>
            </div>
             {/* Yearly */}
             <div className="price-card" style={{background:'#0f172a', color:'white', border:'none'}}>
                <h3 style={{color:'#e2e8f0'}}>Yearly Pro</h3>
                <div className="price-amount">₹4999<span style={{fontSize:'16px', color:'#94a3b8'}}>/yr</span></div>
                <p style={{color:'#4ade80'}}>Save ₹2,189 per year!</p>
                <Link to="/payment/yearly" className="btn-outline" style={{background:'white', border:'none'}}>Get Yearly</Link>
                <ul className="check-list" style={{color:'#cbd5e1'}}><li>⭐ Verified Badge</li><li>⭐ Priority Support</li></ul>
            </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize:'30px', fontWeight:'800' }}>FAQ ❓</h2>
              {[
                  {q: "Is it really free?", a: "Yes! Use it for free until you earn ₹3000."},
                  {q: "When do I get money?", a: "Instantly. Buyer pays directly to your UPI."},
                  {q: "How to prevent piracy?", a: "We stamp buyer details on every PDF."},
              ].map((faq, i) => (
                  <div key={i} className="faq-item" onClick={() => toggleFaq(i)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize:'18px' }}>
                          {faq.q} <span style={{color: '#2563eb'}}>{openFaq === i ? '−' : '+'}</span>
                      </div>
                      {openFaq === i && <p style={{ marginTop: '10px', color: '#64748b' }}>{faq.a}</p>}
                  </div>
              ))}
          </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div style={{maxWidth:'1200px', margin:'0 auto', textAlign:'center'}}>
            <h2 style={{fontSize:'36px', fontWeight:'800', marginBottom:'30px'}}>Ready to start earning?</h2>
            <Link to="/free/signup" style={{background:'white', color:'black', padding:'15px 35px', borderRadius:'30px', fontWeight:'bold', textDecoration:'none', display:'inline-flex', alignItems:'center'}}>
                Create Free Account <Lock size={18} style={{marginLeft:'10px'}}/>
            </Link>
        </div>
        
        <div className="footer-container">
            <div>
                <img src="/logo.png" alt="Bititap" style={{height:'50px', filter:'brightness(0) invert(1)'}} />
                <p style={{marginTop:'20px', color:'#94a3b8'}}>Empowering creators.</p>
            </div>
            <div className="footer-links">
                <h4>Company</h4>
                <ul><li>Home</li><li>About</li><li>Contact</li></ul>
            </div>
            <div className="footer-links">
                <h4>Legal</h4>
                <ul><li>Privacy Policy</li><li>Terms</li><li>Refunds</li></ul>
            </div>
            <div className="footer-links">
                <h4>Follow Us</h4>
                <div style={{display:'flex', gap:'15px', marginTop:'10px'}}>
                   <Twitter color="#94a3b8"/> <Instagram color="#94a3b8"/> <Linkedin color="#94a3b8"/>
                </div>
                <p style={{marginTop:'15px', fontSize:'14px', color:'#94a3b8'}}><Mail size={14} style={{verticalAlign:'middle'}}/> support@bititap.com</p>
            </div>
        </div>
        <div style={{textAlign:'center', marginTop:'60px', color:'#475569', fontSize:'14px'}}>© 2026 Bititap Inc.</div>
      </footer>
    </div>
  );
};

export default Home;