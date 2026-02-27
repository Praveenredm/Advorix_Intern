import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div style={{
                minHeight: '100vh',
                background: '#3d348b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                fontFamily: "'DM Sans', sans-serif",
            }}>
                <div style={{
                    maxWidth: 500, width: '100%',
                    background: '#141d2e',
                    border: '1px solid rgba(255,107,107,0.2)',
                    borderRadius: 20,
                    padding: '48px 44px',
                    boxShadow: '0 24px 80px rgba(0,0,0,.5)',
                    textAlign: 'center',
                }}>
                    {/* Icon */}
                    <div style={{
                        width: 64, height: 64, borderRadius: 18,
                        background: 'rgba(255,107,107,0.1)',
                        border: '1px solid rgba(255,107,107,0.25)',
                        display: 'grid', placeItems: 'center',
                        color: '#ff6b6b', margin: '0 auto 24px',
                    }}>
                        <AlertOctagon size={30} />
                    </div>

                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        color: '#f0ede6', fontSize: '1.6rem',
                        marginBottom: 12,
                    }}>
                        Something went wrong
                    </h1>

                    <p style={{
                        color: '#8a9bb5', fontSize: '0.9rem',
                        lineHeight: 1.6, marginBottom: 24,
                    }}>
                        An unexpected error occurred. The error details are shown below.
                    </p>

                    {/* Error detail */}
                    <pre style={{
                        background: 'rgba(255,107,107,0.06)',
                        border: '1px solid rgba(255,107,107,0.15)',
                        borderRadius: 10,
                        padding: '14px 18px',
                        fontSize: '0.78rem',
                        color: '#ff9a9a',
                        textAlign: 'left',
                        overflow: 'auto',
                        maxHeight: 120,
                        marginBottom: 32,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}>
                        {this.state.error?.toString()}
                    </pre>

                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '11px 28px',
                            background: '#f7b801',
                            border: 'none', borderRadius: 10,
                            color: '#3d348b', fontWeight: 700,
                            fontSize: '0.9rem', cursor: 'pointer',
                            fontFamily: "'DM Sans', sans-serif",
                            boxShadow: '0 4px 16px rgba(247,184,1,0.3)',
                            transition: 'all .2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f18701'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f7b801'}
                    >
                        <RefreshCw size={16} />
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;

