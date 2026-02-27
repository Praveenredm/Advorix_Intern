import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/');
  };

  const handleGoogleLogin = async () => {
    const mockGoogleData = {
      email: 'teacher@gmail.com',
      name: 'John Google',
      picture: 'https://lh3.googleusercontent.com/a/mock-pic',
    };
    await googleLogin(mockGoogleData);
    navigate('/');
  };

  return (
    <div className="auth-page">
      {/* decorative orbs */}
      <div style={{
        position:'fixed', top:'15%', left:'10%',
        width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(247,184,1,0.06) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />
      <div style={{
        position:'fixed', bottom:'20%', right:'8%',
        width:250, height:250, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />

      <motion.div
        className="auth-container"
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.5, ease:'easeOut' }}
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
            <h1>Welcome Back</h1>
            <p>Sign in to your teacher account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><Mail size={14} /> Email Address</label>
              <div style={{ position:'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div style={{ textAlign:'right', marginTop:-4 }}>
                <a href="#" style={{ fontSize:'0.78rem', color:'var(--accent)' }}>
                  Forgot password?
                </a>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', marginTop:4, padding:'13px' }}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading
                ? <><span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> Signing in…</>
                : <><LogIn size={17} /> Sign In</>
              }
            </motion.button>
          </form>

          <div className="auth-divider"><span>OR</span></div>

          <div className="social-auth">
            <motion.button
              className="btn btn-secondary social-btn"
              onClick={handleGoogleLogin}
              whileTap={{ scale: 0.98 }}
              style={{ padding:'12px 20px' }}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width:18, height:18 }} />
              Continue with Google
            </motion.button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

