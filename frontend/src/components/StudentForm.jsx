import { useState, useEffect } from 'react';
import { User, Mail, Phone, Hash, Building2, MapPin, X, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const DEPARTMENTS = [
    'Architecture',
    'Biology',
    'Business Administration',
    'Chemistry',
    'Civil Engineering',
    'Computer Science',
    'Economics',
    'Electrical Engineering',
    'Information Technology',
    'Mathematics',
    'Mechanical Engineering',
    'Physics',
];

const initialState = {
    firstName: '', lastName: '', email: '',
    age: '', phone: '', department: '', address: '',
};

export default function StudentForm({ initialData, onSubmit, submitLabel = 'Save Student' }) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);
    const [touched, setTouched]   = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName:  initialData.firstName  || '',
                lastName:   initialData.lastName   || '',
                email:      initialData.email      || '',
                age:        initialData.age != null ? String(initialData.age) : '',
                phone:      initialData.phone      || '',
                department: initialData.department || '',
                address:    initialData.address    || '',
            });
        }
    }, [initialData]);

    const validate = () => {
        const e = {};
        if (!formData.firstName.trim())  e.firstName  = 'Required';
        if (!formData.lastName.trim())   e.lastName   = 'Required';
        if (!formData.email.trim())      e.email      = 'Required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
        if (!formData.age)               e.age        = 'Required';
        else if (Number(formData.age) < 10 || Number(formData.age) > 100) e.age = '10–100';
        if (!formData.department)        e.department = 'Please select';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = Object.fromEntries(Object.keys(formData).map(k => [k, true]));
        setTouched(allTouched);
        if (!validate()) return;
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    // Generic field renderer
    const Field = ({ icon: Icon, label, name, type = 'text', placeholder, span = false }) => {
        const hasError  = touched[name] && errors[name];
        const isValid   = touched[name] && !errors[name] && formData[name];
        return (
            <div className="form-group" style={span ? { gridColumn: '1 / -1' } : {}}>
                <label>
                    <Icon size={13} />
                    {label}
                    {['firstName','lastName','email','age','department'].includes(name) && (
                        <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>
                    )}
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className="form-input"
                        style={{
                            borderColor: hasError  ? 'var(--danger)'  :
                                         isValid   ? 'rgba(72,187,120,.5)' : undefined,
                            paddingRight: (hasError || isValid) ? 40 : undefined,
                        }}
                    />
                    {isValid && (
                        <CheckCircle size={16} style={{
                            position: 'absolute', right: 12, top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--success)', pointerEvents: 'none',
                        }} />
                    )}
                </div>
                {hasError && (
                    <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '0.73rem', color: 'var(--danger)', fontWeight: 600 }}
                    >
                        {errors[name]}
                    </motion.span>
                )}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="card">
                {/* ── Section: Personal ── */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        marginBottom: 20, paddingBottom: 16,
                        borderBottom: '1px solid var(--border-main)',
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: 'var(--accent-soft)',
                            border: '1px solid rgba(247,184,1,0.25)',
                            display: 'grid', placeItems: 'center',
                            color: 'var(--accent)',
                        }}>
                            <User size={14} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                            Personal Information
                        </h3>
                    </div>

                    <div className="form-grid">
                        <Field icon={User}  label="First Name"  name="firstName"  placeholder="John" />
                        <Field icon={User}  label="Last Name"   name="lastName"   placeholder="Doe" />
                    </div>
                </div>

                {/* ── Section: Contact ── */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        marginBottom: 20, paddingBottom: 16,
                        borderBottom: '1px solid var(--border-main)',
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.2)',
                            display: 'grid', placeItems: 'center',
                            color: '#60a5fa',
                        }}>
                            <Mail size={14} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                            Contact Details
                        </h3>
                    </div>

                    <div className="form-grid">
                        <Field icon={Mail}  label="Email Address"  name="email"  type="email" placeholder="john@university.edu" />
                        <Field icon={Phone} label="Phone Number"   name="phone"  placeholder="+1 (555) 000-0000" />
                    </div>
                </div>

                {/* ── Section: Academic ── */}
                <div style={{ marginBottom: 12 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        marginBottom: 20, paddingBottom: 16,
                        borderBottom: '1px solid var(--border-main)',
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)',
                            display: 'grid', placeItems: 'center',
                            color: '#f7b801',
                        }}>
                            <Building2 size={14} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-sub)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                            Academic Information
                        </h3>
                    </div>

                    <div className="form-grid" style={{ marginBottom: 20 }}>
                        {/* Age */}
                        <div className="form-group">
                            <label>
                                <Hash size={13} />
                                Age <span style={{ color: 'var(--accent)' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="21"
                                    min={10} max={100}
                                    className="form-input"
                                    style={{
                                        borderColor: touched.age && errors.age
                                            ? 'var(--danger)'
                                            : touched.age && formData.age
                                            ? 'rgba(72,187,120,.5)' : undefined,
                                    }}
                                />
                            </div>
                            {touched.age && errors.age && (
                                <motion.span initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}
                                    style={{ fontSize:'0.73rem', color:'var(--danger)', fontWeight:600 }}>
                                    {errors.age}
                                </motion.span>
                            )}
                        </div>

                        {/* Department */}
                        <div className="form-group">
                            <label>
                                <Building2 size={13} />
                                Department <span style={{ color: 'var(--accent)' }}>*</span>
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-input"
                                style={{
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a9bb5' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 14px center',
                                    paddingRight: 36,
                                    cursor: 'pointer',
                                    borderColor: touched.department && errors.department
                                        ? 'var(--danger)'
                                        : touched.department && formData.department
                                        ? 'rgba(72,187,120,.5)' : undefined,
                                }}
                            >
                                <option value="">Select department…</option>
                                {DEPARTMENTS.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {touched.department && errors.department && (
                                <motion.span initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}
                                    style={{ fontSize:'0.73rem', color:'var(--danger)', fontWeight:600 }}>
                                    {errors.department}
                                </motion.span>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <label><MapPin size={13} /> Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Education St, Knowledge City, State 00000"
                            className="form-input"
                            rows={3}
                            style={{ resize: 'vertical', minHeight: 80 }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Actions ── */}
            <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: 12,
                marginTop: 20,
            }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => window.history.back()}
                    disabled={loading}
                    style={{ padding: '11px 24px' }}
                >
                    <X size={16} /> Cancel
                </button>
                <motion.button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ minWidth: 180, padding: '11px 28px', justifyContent: 'center' }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading
                        ? <><span className="spinner" style={{ width:17, height:17, borderWidth:2 }} /> Saving…</>
                        : <><Save size={16} /> {submitLabel}</>
                    }
                </motion.button>
            </div>
        </form>
    );
}

