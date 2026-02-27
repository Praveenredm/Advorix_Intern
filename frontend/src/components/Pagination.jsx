import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, pageSize, onPageChange }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    const start = (page - 1) * pageSize + 1;
    const end   = Math.min(page * pageSize, total);

    // Smart page range: always show first, last, and neighbours of current
    const getPages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                pages.push(i);
            } else if (i === page - 2 || i === page + 2) {
                pages.push('…');
            }
        }
        // Deduplicate '…'
        return pages.filter((p, i, arr) => p !== '…' || arr[i - 1] !== '…');
    };

    const btnBase = {
        width: 34, height: 34, borderRadius: 8,
        border: '1px solid var(--border-main)',
        background: 'transparent', color: 'var(--text-sub)',
        cursor: 'pointer', display: 'grid', placeItems: 'center',
        fontSize: '0.84rem', fontWeight: 600,
        transition: 'all .15s', fontFamily: 'var(--font-body)',
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px', borderTop: '1px solid var(--border-main)',
            background: 'var(--bg-app)',
        }}>
            {/* Info */}
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                Showing{' '}
                <strong style={{ color: 'var(--text-main)' }}>{start}–{end}</strong>
                {' '}of{' '}
                <strong style={{ color: 'var(--text-main)' }}>{total}</strong>
                {' '}students
            </span>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                    style={{ ...btnBase, opacity: page === 1 ? .35 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    onMouseEnter={e => { if (page !== 1) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-main)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}
                >
                    <ChevronLeft size={15} />
                </button>

                {getPages().map((p, i) =>
                    p === '…' ? (
                        <span key={`dots-${i}`} style={{ width: 34, textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            style={{
                                ...btnBase,
                                background: page === p ? 'var(--accent)'      : 'transparent',
                                borderColor: page === p ? 'var(--accent)'     : 'var(--border-main)',
                                color:       page === p ? '#3d348b'           : 'var(--text-sub)',
                                boxShadow:   page === p ? '0 2px 10px var(--accent-glow)' : 'none',
                            }}
                            onMouseEnter={e => { if (page !== p) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-main)'; }}}
                            onMouseLeave={e => { if (page !== p) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    style={{ ...btnBase, opacity: page === totalPages ? .35 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    onMouseEnter={e => { if (page !== totalPages) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-main)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    );
}
