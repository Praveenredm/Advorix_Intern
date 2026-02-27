import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullscreen = true, size = 40 }) {
    const wrap = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        ...(fullscreen
            ? { minHeight: '100vh', background: 'var(--bg-app)' }
            : { minHeight: 240 }
        ),
    };

    return (
        <div style={wrap}>
            {/* Dual-ring spinner with gold accent */}
            <div style={{ position: 'relative', width: size, height: size }}>
                <div style={{
                    width: size, height: size,
                    border: `3px solid rgba(247,184,1,0.15)`,
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'spin .7s linear infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 6,
                    border: `2px solid rgba(247,184,1,0.08)`,
                    borderBottomColor: 'rgba(247,184,1,0.5)',
                    borderRadius: '50%',
                    animation: 'spin .5s linear infinite reverse',
                }} />
            </div>

            {fullscreen && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .3 }}
                    style={{
                        fontSize: '0.8rem', color: 'var(--text-dim)',
                        fontWeight: 600, letterSpacing: '.08em',
                        textTransform: 'uppercase',
                    }}
                >
                    Loading…
                </motion.p>
            )}
        </div>
    );
}
