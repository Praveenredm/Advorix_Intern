import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { createStudent } from '../services/api';
import toast from 'react-hot-toast';
import StudentForm from '../components/StudentForm';

export default function AddStudent() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createStudent(formData);
      toast.success('Student registered successfully!');
      navigate('/students');
    } catch {
      toast.error('Failed to add student');
    }
  };

  return (
    <motion.div
      initial={{ opacity:0, y:18 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.35 }}
      style={{ maxWidth:820, margin:'0 auto' }}
    >
      {/* Back */}
      <div style={{ marginBottom:28 }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary"
          style={{ padding:'8px 16px', fontSize:'0.83rem' }}>
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* Header */}
      <div className="page-header" style={{ marginBottom:28 }}>
        <div>
          <h2 style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background:'var(--accent-soft)', border:'1px solid rgba(247,184,1,0.3)',
              display:'grid', placeItems:'center', color:'var(--accent)'
            }}>
              <UserPlus size={20} />
            </div>
            Register New Student
          </h2>
          <p>Fill in the details below to add a student to the system</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div style={{
        display:'flex', gap:0, marginBottom:28,
        background:'var(--bg-card)', border:'1px solid var(--border-main)',
        borderRadius:10, overflow:'hidden', padding:2
      }}>
        {['Personal Info', 'Contact Details', 'Academic Info'].map((step, i) => (
          <div key={step} style={{
            flex:1, padding:'8px 12px', borderRadius:8, textAlign:'center',
            fontSize:'0.75rem', fontWeight:700, letterSpacing:'.03em',
            background: i === 0 ? 'var(--accent)' : 'transparent',
            color: i === 0 ? '#3d348b' : 'var(--text-dim)',
            transition:'all .2s'
          }}>
            {step}
          </div>
        ))}
      </div>

      <StudentForm onSubmit={handleSubmit} submitLabel="Register Student" />
    </motion.div>
  );
}

