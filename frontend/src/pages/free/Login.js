import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react'; // Icons

// CSS Import
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState('');

    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post('http://localhost:5000/api/free/login', formData);
            
            // ✅ Token Save logic
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('plan', res.data.plan);

            setMessage('✅ Login Successful!');
            setMessageType('success');

            // Redirect to Dashboard
            setTimeout(() => navigate('/free/dashboard'), 1500);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Invalid Credentials'));
            setMessageType('error');
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Logo */}
                <img src="/logo.png" alt="Bititap" className="brand-logo" />

                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Login to manage your digital store.</p>

                <form onSubmit={onSubmit}>
                    
                    {/* Email Input */}
                    <div className="form-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                placeholder="you@example.com" 
                                name="email" 
                                value={email} 
                                onChange={onChange} 
                                required 
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                name="password" 
                                value={password} 
                                onChange={onChange} 
                                required 
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login to Dashboard'}
                    </button>

                </form>

                {/* Message Box */}
                {message && (
                    <div className={`message-box ${messageType}`}>
                        {message}
                    </div>
                )}

                <p className="signup-link">
                    Don't have an account? <Link to="/free/signup">Create Free Account <ArrowRight size={12} style={{verticalAlign:'middle'}}/></Link>
                </p>
            </div>
        </div>
    );
};

export default Login;