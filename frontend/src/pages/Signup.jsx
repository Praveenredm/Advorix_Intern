import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Building2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', department: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await signup(formData);
    setLoading(false);
    if (success) navigate('/login');
  };

  return (
    <div className="auth-page">
      <div style={{
        position:'fixed', top:'20%', right:'12%',
        width:280, height:280, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(247,184,1,0.07) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />
      <div style={{
        position:'fixed', bottom:'15%', left:'8%',
        width:240, height:240, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />

      <motion.div
        className="auth-container"
        style={{ maxWidth:480 }}
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.5 }}
      >
        {/* Brand mark */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{
            width:56, height:56, background:'var(--accent)',
            borderRadius:16, display:'grid', placeItems:'center',
            margin:'0 auto 16px',
            boxShadow:'0 8px 24px var(--accent-glow)'
          }}>
            <Sparkles size={26} color="#3d348b" />
          </div>
          <p style={{ fontSize:'0.72rem', letterSpacing:'.15em', textTransform:'uppercase',
                      color:'var(--text-dim)', fontWeight:700 }}>
            StudentHub Portal
          </p>
        </div>

        <div className="auth-card card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join StudentHub as a teacher</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-grid">
              <div className="form-group">
                <label><User size={14} /> Full Name</label>
                <input
                  name="full_name" type="text"
                  className="form-input"
                  placeholder="Prof. Jane Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label><Building2 size={14} /> Department</label>
                <input
                  name="department" type="text"
                  className="form-input"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label><Mail size={14} /> Email Address</label>
              <input
                name="email" type="email"
                className="form-input"
                placeholder="jane@school.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input
                name="password" type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'13px' }}
              disabled={loading}
              whileTap={{ scale:0.98 }}
            >
              {loading
                ? <><span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> Creating…</>
                : <><UserPlus size={17} /> Create Account</>
              }
            </motion.button>
          </form>

          <p className="auth-footer" style={{ marginTop:28 }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

