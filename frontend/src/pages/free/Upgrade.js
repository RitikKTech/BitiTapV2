import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Crown } from 'lucide-react';

const Upgrade = () => (
    <div className="dashboard-layout">
        <aside className="sidebar"><Link to="/free/dashboard" className="nav-item"><LayoutDashboard size={18}/> Back</Link></aside>
        <main className="main-content"><h2>Upgrade Plan 💎</h2><p>Coming Soon...</p></main>
    </div>
);
export default Upgrade;