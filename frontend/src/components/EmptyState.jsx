import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, message, actionLabel, actionTo, onAction }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '64px 32px', textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.08)',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.01)',
            }}
        >
            {/* Icon ring */}
            <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--accent-soft)',
                border: '1px solid rgba(247,184,1,0.2)',
                display: 'grid', placeItems: 'center',
                color: 'var(--accent)',
                marginBottom: 20,
                opacity: 0.8,
            }}>
                {icon}
            </div>

            <h3 style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                color: 'var(--text-main)',
            }}>
                {title}
            </h3>

            <p style={{
                margin: '0 auto 24px',
                maxWidth: 320,
                color: 'var(--text-sub)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
            }}>
                {message}
            </p>

            {actionLabel && (
                actionTo ? (
                    <Link to={actionTo} className="btn btn-primary">
                        {actionLabel}
                    </Link>
                ) : (
                    <button onClick={onAction} className="btn btn-primary">
                        {actionLabel}
                    </button>
                )
            )}
        </motion.div>
    );
}
