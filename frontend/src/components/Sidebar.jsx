import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserPlus,
    Database, Sparkles, LogOut, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { seedData } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
    { to: '/',             icon: LayoutDashboard, label: 'Dashboard',    end: true },
    { to: '/students',     icon: Users,           label: 'All Students', end: false },
    { to: '/students/add', icon: UserPlus,        label: 'Add Student',  end: false },
];

export default function Sidebar({ isOpen, onClose }) {
    const [seeding, setSeeding] = useState(false);
    const { user, logout }      = useAuth();
    const navigate              = useNavigate();

    const handleSeed = async () => {
        if (seeding) return;
        setSeeding(true);
        try {
            const res = await seedData();
            toast.success(res.data.message || 'Demo data loaded!');
            window.location.reload();
        } catch {
            toast.error('Failed to seed data. Is the backend running?');
        } finally {
            setSeeding(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    return (
        <>
            {/* Mobile backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 90,
                        }}
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            <aside className={`sidebar${isOpen ? ' open' : ''}`}>

                {/* ── Logo ── */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <span>StudentHub</span>
                        <small>Academic Portal</small>
                    </div>
                </div>

                {/* ── Nav ── */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Navigation</div>

                    {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                            onClick={onClose}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            <span style={{ flex: 1 }}>{label}</span>
                            <ChevronRight size={14} style={{ opacity: 0.3 }} />
                        </NavLink>
                    ))}

                    <div className="sidebar-section-label" style={{ marginTop: 16 }}>Tools</div>

                    {/* Seed button styled as nav item */}
                    <button
                        onClick={handleSeed}
                        disabled={seeding}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '11px 14px', borderRadius: 8,
                            color: 'var(--text-sub)', fontSize: '0.88rem', fontWeight: 500,
                            background: 'transparent', border: 'none', cursor: seeding ? 'not-allowed' : 'pointer',
                            width: '100%', transition: 'all .2s', opacity: seeding ? .6 : 1,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {seeding
                            ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                            : <Database size={18} strokeWidth={1.8} />
                        }
                        <span style={{ flex: 1 }}>{seeding ? 'Loading data…' : 'Seed Demo Data'}</span>
                    </button>
                </nav>

                {/* ── User / Logout ── */}
                <div className="sidebar-footer">
                    {user && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '12px 14px', marginBottom: 10,
                            background: 'var(--bg-input)',
                            borderRadius: 10, border: '1px solid var(--border-main)',
                        }}>
                            <div className="avatar" style={{ flexShrink: 0 }}>
                                {initials}
                            </div>
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                <p style={{
                                    fontSize: '0.84rem', fontWeight: 700, margin: 0,
                                    color: 'var(--text-main)',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                    {user.full_name}
                                </p>
                                <p style={{
                                    fontSize: '0.7rem', color: 'var(--text-sub)', margin: 0,
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                    {user.department || user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: 8, width: '100%', padding: '10px',
                            background: 'rgba(255,107,107,0.08)',
                            border: '1px solid rgba(255,107,107,0.2)',
                            borderRadius: 10, color: 'var(--danger)',
                            fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all .2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,107,107,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(255,107,107,0.4)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,107,107,0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255,107,107,0.2)';
                        }}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}