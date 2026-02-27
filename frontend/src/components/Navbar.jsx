import { Moon, Sun, Menu, Bell, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
    '/':              { title: 'Dashboard',         sub: 'Overview & analytics' },
    '/students':      { title: 'Students Directory', sub: 'Manage your records' },
    '/students/add':  { title: 'Add Student',        sub: 'Register a new student' },
};

const getPageMeta = (pathname) => {
    if (pathname.includes('/edit/'))  return { title: 'Edit Student',  sub: 'Update student information' };
    if (pathname.includes('/view/') || pathname.match(/\/students\/[^/]+$/))
                                      return { title: 'Student Profile', sub: 'View full details' };
    return PAGE_TITLES[pathname] || { title: 'StudentHub', sub: '' };
};

export default function Navbar({ onMenuToggle }) {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user }                    = useAuth();
    const location                    = useLocation();

    const { title, sub } = getPageMeta(location.pathname);

    const initials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <header style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px',
            height: 68,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-main)',
            position: 'sticky', top: 0, zIndex: 50,
            backdropFilter: 'blur(12px)',
        }}>

            {/* ── Left ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Mobile menu toggle */}
                <button
                    onClick={onMenuToggle}
                    className="icon-btn"
                    style={{ display: 'none' }}
                    id="mobile-menu-btn"
                >
                    <Menu size={20} />
                </button>

                {/* Page title */}
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: .25 }}
                >
                    <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                        {title}
                    </h3>
                    {sub && (
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                            {sub}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* ── Right ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                {/* Date */}
                <span style={{
                    fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 500,
                    padding: '6px 12px',
                    background: 'var(--bg-input)',
                    borderRadius: 8,
                    border: '1px solid var(--border-main)',
                    whiteSpace: 'nowrap',
                }}>
                    {today}
                </span>

                {/* Theme toggle */}
                <motion.button
                    className="icon-btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    whileTap={{ scale: .9, rotate: 20 }}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>

                {/* Notifications */}
                <button className="icon-btn" title="Notifications" style={{ position: 'relative' }}>
                    <Bell size={18} />
                    {/* unread dot */}
                    <span style={{
                        position: 'absolute', top: 7, right: 7,
                        width: 7, height: 7, borderRadius: '50%',
                        background: 'var(--accent)',
                        border: '1.5px solid var(--bg-card)',
                    }} />
                </button>

                {/* Divider */}
                <div style={{ width: 1, height: 28, background: 'var(--border-main)', margin: '0 4px' }} />

                {/* User pill */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 10px 6px 6px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-main)',
                    borderRadius: 40, cursor: 'pointer',
                    transition: 'border-color .2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(247,184,1,0.35)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-main)'}
                >
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: '0.68rem', flexShrink: 0 }}>
                        {initials}
                    </div>
                    {user && (
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                            {user.full_name?.split(' ')[0]}
                        </span>
                    )}
                    <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
                </div>
            </div>
        </header>
    );
}
