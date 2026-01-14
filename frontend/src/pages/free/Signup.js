import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react'; // Icons added

// CSS Import
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    
    const navigate = useNavigate();
    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post('http://localhost:5000/api/free/signup', formData);
            setMessage('✅ ' + res.data.message);
            setMessageType('success');
            
            // 2 Second baad login page par bhej do
            setTimeout(() => navigate('/free/login'), 2500);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Error Occurred'));
            setMessageType('error');
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                {/* Logo */}
                <img src="/logo.png" alt="Bititap" className="brand-logo" />

                <h2 className="title">Create Free Account</h2>
                <p className="subtitle">Start selling your digital products today.</p>

                <form onSubmit={onSubmit}>
                    
                    {/* Name Input */}
                    <div className="form-group">
                        <label className="input-label">Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                name="name" 
                                value={name} 
                                onChange={onChange} 
                                required 
                                className="form-input"
                            />
                        </div>
                    </div>

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
                                placeholder="Create a strong password" 
                                name="password" 
                                value={password} 
                                onChange={onChange} 
                                required 
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                </form>

                {/* Message Box */}
                {message && (
                    <div className={`message-box ${messageType}`}>
                        {message}
                    </div>
                )}

                <p className="login-link">
                    Already have an account? <Link to="/free/login">Login here <ArrowRight size={14} style={{verticalAlign:'middle'}}/></Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;