import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
    const [message, setMessage] = useState('Verifying your account...');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const { token } = useParams(); // URL se token nikalega

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                // Backend ko token bhejo
                const res = await axios.post('http://localhost:5000/api/free/verify', { token });
                setMessage('✅ ' + res.data.message);
                setStatus('success');
            } catch (err) {
                setMessage('❌ ' + (err.response?.data?.message || 'Verification Failed. Link might be expired.'));
                setStatus('error');
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ 
                border: '1px solid #ddd', 
                padding: '40px', 
                borderRadius: '10px', 
                display: 'inline-block',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                <h1>Email Verification</h1>
                
                <h3 style={{ 
                    color: status === 'success' ? 'green' : status === 'error' ? 'red' : 'blue',
                    margin: '20px 0'
                }}>
                    {message}
                </h3>

                {status === 'success' && (
                    <Link to="/free/login" style={{
                        padding: '10px 20px',
                        backgroundColor: 'green',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold'
                    }}>
                        Login Now 🚀
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Verify;