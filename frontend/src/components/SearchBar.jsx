import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
    const [innerValue, setInnerValue] = useState(value);

    // Sync when parent clears
    useEffect(() => { setInnerValue(value); }, [value]);

    // Debounce: fire onChange 400ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (innerValue !== value) onChange(innerValue);
        }, 400);
        return () => clearTimeout(timer);
    }, [innerValue]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ position: 'relative', flex: 1 }}>
            {/* Search icon */}
            <Search
                size={16}
                style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)', pointerEvents: 'none',
                }}
            />

            <input
                type="text"
                value={innerValue}
                onChange={e => setInnerValue(e.target.value)}
                placeholder="Search by name, email or department…"
                className="form-input"
                style={{
                    paddingLeft: 40,
                    paddingRight: innerValue ? 36 : 14,
                }}
            />

            {/* Clear button */}
            {innerValue && (
                <button
                    onClick={() => { setInnerValue(''); onChange(''); }}
                    style={{
                        position: 'absolute', right: 10, top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent', border: 'none',
                        color: 'var(--text-dim)', cursor: 'pointer',
                        display: 'grid', placeItems: 'center', padding: 2,
                        borderRadius: 4, transition: 'color .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}