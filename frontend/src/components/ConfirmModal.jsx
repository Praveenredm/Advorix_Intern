import { AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999, padding: 24,
        }}>
            <motion.div
                initial={{ opacity: 0, scale: .94, y: 16 }}
                animate={{ opacity: 1, scale: 1,   y: 0 }}
                exit={{ opacity: 0, scale: .94, y: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-main)',
                    borderRadius: 20, padding: 36,
                    maxWidth: 440, width: '100%',
                    boxShadow: '0 32px 80px rgba(0,0,0,.6)',
                    position: 'relative',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onCancel}
                    style={{
                        position: 'absolute', top: 16, right: 16,
                        background: 'transparent', border: 'none',
                        color: 'var(--text-dim)', cursor: 'pointer',
                        padding: 4, borderRadius: 6, display: 'grid', placeItems: 'center',
                        transition: 'color .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'var(--danger-soft)',
                    border: '1px solid rgba(255,107,107,0.25)',
                    display: 'grid', placeItems: 'center',
                    color: 'var(--danger)', marginBottom: 20,
                }}>
                    <AlertTriangle size={24} />
                </div>

                {/* Text */}
                <h3 style={{ margin: '0 0 10px', fontSize: '1.15rem' }}>{title}</h3>
                <p style={{ margin: '0 0 28px', color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {message}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        Cancel
                    </button>
                    <motion.button
                        className="btn"
                        onClick={onConfirm}
                        whileTap={{ scale: .97 }}
                        style={{
                            flex: 1, justifyContent: 'center',
                            background: 'var(--danger)',
                            border: '1px solid var(--danger)',
                            color: '#fff',
                            boxShadow: '0 4px 16px rgba(255,107,107,0.3)',
                        }}
                    >
                        Yes, Delete
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}