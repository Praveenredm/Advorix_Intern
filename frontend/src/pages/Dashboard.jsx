import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, Building2, BookOpen, TrendingUp,
    Plus, Activity, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getStats } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StudentTable from '../components/StudentTable';

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } }
};

const STAT_CARDS = (stats, deptCount) => [
    {
        icon: <Users size={24} />,
        value: stats.totalStudents,
        label: 'Total Students',
        color: '#7678ed',
        bg: 'rgba(118,120,237,0.12)',
    },
    {
        icon: <Building2 size={24} />,
        value: deptCount,
        label: 'Departments',
        color: '#f7b801',
        bg: 'rgba(247,184,1,0.12)',
    },
    {
        icon: <BookOpen size={24} />,
        value: stats.recentStudents?.length ?? 0,
        label: 'Recent Entries',
        color: '#f18701',
        bg: 'rgba(241,135,1,0.12)',
    },
    {
        icon: <TrendingUp size={24} />,
        value: 'Active',
        label: 'System Status',
        color: '#f35b04',
        bg: 'rgba(243,91,4,0.12)',
    },
];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await getStats();
            setStats(res.data);
        } catch {
            setError('Failed to load dashboard data. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <EmptyState icon={<Activity size={48} />} title="Connection Error" message={error} />;
    if (!stats) return null;

    const deptCount = stats.departments ? Object.keys(stats.departments).length : 0;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">

            {/* ── Page Header ───────────────────────── */}
            <motion.div variants={itemVariants} className="page-header">
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                        <LayoutDashboard size={26} style={{ color: 'var(--accent)' }} />
                        Dashboard Overview
                    </h2>
                    <p>Real-time analytics for your institution</p>
                </div>
                <Link to="/students/add" className="btn btn-primary">
                    <Plus size={17} /> Add Student
                </Link>
            </motion.div>

            {/* ── Stat Cards ────────────────────────── */}
            <motion.div variants={containerVariants} className="stats-grid">
                {STAT_CARDS(stats, deptCount).map((s, i) => (
                    <motion.div key={i} variants={itemVariants} className="card stat-card"
                        style={{ '--current-color': s.color }}>
                        <div className="stat-icon" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
                            {s.icon}
                        </div>
                        <div className="stat-info">
                            <h3 style={{ color: s.color }}>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* ── Bottom Grid ───────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '28px 28px 0', marginBottom: 20
                    }}>
                        <div>
                            <h3 style={{ marginBottom: 2 }}>Recent Activity</h3>
                            <p style={{ fontSize: '0.8rem' }}>Latest student registrations</p>
                        </div>
                        <Link to="/students" style={{
                            fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)',
                            background: 'var(--accent-soft)', padding: '6px 14px',
                            borderRadius: 6, border: '1px solid rgba(247,184,1,0.2)'
                        }}>
                            View All →
                        </Link>
                    </div>
                    {stats.recentStudents?.length > 0
                        ? <StudentTable students={stats.recentStudents} onDelete={() => { }} />
                        : <div style={{ padding: 32 }}>
                            <EmptyState icon={<Users size={40} />} title="No Students Yet"
                                message="Seed demo data or add your first student." />
                        </div>
                    }
                </motion.div>

                {/* Department Distribution */}
                <motion.div variants={itemVariants} className="card">
                    <h3 style={{ marginBottom: 6 }}>Departments</h3>
                    <p style={{ marginBottom: 24, fontSize: '0.8rem' }}>Student distribution by faculty</p>

                    {stats.departments && Object.keys(stats.departments).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {Object.entries(stats.departments).map(([dept, count], idx) => {
                                const total = Object.values(stats.departments).reduce((a, b) => a + b, 0);
                                const pct = Math.round((count / total) * 100);
                                return (
                                    <div key={dept}>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            marginBottom: 6, fontSize: '0.84rem'
                                        }}>
                                            <span style={{ fontWeight: 600 }}>{dept}</span>
                                            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{count}</span>
                                        </div>
                                        <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: .8, delay: idx * .1, ease: 'easeOut' }}
                                                style={{
                                                    height: '100%', background: 'linear-gradient(90deg, var(--accent), #b8860b)',
                                                    borderRadius: 3
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState icon={<Building2 size={40} />} title="No Data"
                            message="Add students to see breakdown." />
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
