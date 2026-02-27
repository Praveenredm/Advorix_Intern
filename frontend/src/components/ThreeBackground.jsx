/**
 * ThreeBackground — atmospheric animated background
 *
 * Replaces the @react-three/fiber dependency with a pure CSS/SVG
 * solution that achieves the same "floating orbs" effect without
 * any bundle-size or WebGL compatibility concerns.
 *
 * Drop this anywhere in your tree (e.g. in main.jsx or App.jsx)
 * and it will sit behind everything via position:fixed.
 */
export default function ThreeBackground() {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 0,
            pointerEvents: 'none', overflow: 'hidden',
        }}>
            {/* Orb 1 — gold, top-left */}
            <div style={{
                position: 'absolute',
                top: '8%', left: '-5%',
                width: 560, height: 560,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 40%, rgba(247, 184, 1, 0.09), transparent 70%)',
                animation: 'orbFloat1 14s ease-in-out infinite',
                filter: 'blur(2px)',
            }} />

            {/* Orb 2 — indigo, bottom-right */}
            <div style={{
                position: 'absolute',
                bottom: '-10%', right: '-8%',
                width: 700, height: 700,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 60% 60%, rgba(118, 120, 237, 0.07), transparent 70%)',
                animation: 'orbFloat2 18s ease-in-out infinite',
                filter: 'blur(2px)',
            }} />

            {/* Orb 3 — teal, mid */}
            <div style={{
                position: 'absolute',
                top: '45%', left: '30%',
                width: 400, height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 50% 50%, rgba(61, 52, 139, 0.05), transparent 70%)',
                animation: 'orbFloat3 22s ease-in-out infinite',
                filter: 'blur(2px)',
            }} />

            {/* Orb 4 — gold accent, top-right */}
            <div style={{
                position: 'absolute',
                top: '20%', right: '5%',
                width: 320, height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 50% 50%, rgba(241, 135, 1, 0.05), transparent 70%)',
                animation: 'orbFloat4 16s ease-in-out infinite',
            }} />

            <style>{`
                @keyframes orbFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%       { transform: translate(40px, 30px) scale(1.05); }
                    66%       { transform: translate(-20px, 50px) scale(0.97); }
                }
                @keyframes orbFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    40%       { transform: translate(-60px, -40px) scale(1.08); }
                    70%       { transform: translate(20px, -60px) scale(0.95); }
                }
                @keyframes orbFloat3 {
                    0%, 100% { transform: translate(0, 0); }
                    50%       { transform: translate(30px, -40px); }
                }
                @keyframes orbFloat4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    45%       { transform: translate(-25px, 35px) scale(1.04); }
                }
            `}</style>
        </div>
    );
}