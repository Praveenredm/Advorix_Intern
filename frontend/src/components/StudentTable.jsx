import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentTable({ students, onDelete }) {
    const navigate = useNavigate();

    const getInitials = (first, last) =>
        `${(first || '')[0] || ''}${(last || '')[0] || ''}`.toUpperCase();

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-main)' }}>
                        {['Student', 'Contact', 'Age', 'Department', 'Actions'].map((h, i) => (
                            <th key={h} style={{
                                padding: '14px 20px',
                                fontSize: '0.68rem', fontWeight: 700,
                                letterSpacing: '.1em', textTransform: 'uppercase',
                                color: 'var(--text-dim)',
                                textAlign: i === 4 ? 'right' : 'left',
                                whiteSpace: 'nowrap',
                            }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, idx) => (
                        <motion.tr
                            key={s.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.2 }}
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                transition: 'background .15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {/* Student */}
                            <td style={{ padding: '14px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className="avatar">
                                        {getInitials(s.firstName, s.lastName)}
                                    </div>
                                    <div>
                                        <p style={{
                                            margin: 0, fontWeight: 600,
                                            fontSize: '0.9rem', color: 'var(--text-main)',
                                        }}>
                                            {s.firstName} {s.lastName}
                                        </p>
                                        {s.address && (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                marginTop: 2,
                                            }}>
                                                <MapPin size={11} color="var(--text-dim)" />
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                                    {s.address.split(',')[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>

                            {/* Contact */}
                            <td style={{ padding: '14px 20px' }}>
                                <p style={{ margin: 0, fontSize: '0.86rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {s.email}
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                                    {s.phone || '—'}
                                </p>
                            </td>

                            {/* Age */}
                            <td style={{ padding: '14px 20px' }}>
                                <span style={{
                                    fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)',
                                }}>
                                    {s.age}
                                </span>
                            </td>

                            {/* Department badge */}
                            <td style={{ padding: '14px 20px' }}>
                                <span className="badge">{s.department}</span>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 20px' }}>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                    <button
                                        className="icon-btn"
                                        title="View profile"
                                        onClick={() => navigate(`/students/view/${s.id}`)}
                                        style={{ color: 'var(--accent)' }}
                                    >
                                        <Eye size={15} />
                                    </button>
                                    <button
                                        className="icon-btn"
                                        title="Edit student"
                                        onClick={() => navigate(`/students/edit/${s.id}`)}
                                        style={{ color: '#60a5fa' }}
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        className="icon-btn"
                                        title="Delete student"
                                        onClick={() => onDelete(s)}
                                        style={{ color: 'var(--danger)' }}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}