import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail, Phone, Calendar, Building2,
  MapPin, Pencil, Trash2, ArrowLeft, User, Hash
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getStudentById, deleteStudent } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';

const containerVariants = {
  hidden: { opacity:0 },
  show:   { opacity:1, transition:{ staggerChildren:.07 } }
};
const itemVariants = {
  hidden: { opacity:0, y:14 },
  show:   { opacity:1, y:0, transition:{ type:'spring', stiffness:140, damping:18 } }
};

function InfoBlock({ icon, label, value }) {
  return (
    <motion.div variants={itemVariants} style={{
      background:'var(--bg-input)', borderRadius:12,
      padding:'18px 20px', border:'1px solid var(--border-main)'
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:7,
        fontSize:'0.7rem', fontWeight:700, letterSpacing:'.07em',
        textTransform:'uppercase', color:'var(--text-dim)', marginBottom:10
      }}>
        {icon} {label}
      </div>
      <p style={{
        margin:0, fontSize:'1rem', fontWeight:500,
        color: value ? 'var(--text-main)' : 'var(--text-dim)',
        fontStyle: value ? 'normal' : 'italic'
      }}>
        {value || 'Not provided'}
      </p>
    </motion.div>
  );
}

export default function ViewStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getStudentById(id);
        setStudent(res.data);
      } catch {
        toast.error('Failed to load student details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteStudent(id);
      toast.success('Student removed');
      navigate('/students');
    } catch {
      toast.error('Failed to delete student');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!student) return (
    <div style={{ padding:40, textAlign:'center', color:'var(--text-sub)' }}>
      Student not found.
    </div>
  );

  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="show"
      style={{ maxWidth:880, margin:'0 auto' }}
    >
      {/* Back */}
      <motion.div variants={itemVariants} style={{ marginBottom:28 }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary"
          style={{ padding:'8px 16px', fontSize:'0.83rem' }}>
          <ArrowLeft size={15} /> Back to Directory
        </button>
      </motion.div>

      {/* Hero Card */}
      <motion.div variants={itemVariants} className="card" style={{ padding:0, overflow:'hidden', marginBottom:24 }}>
        {/* Hero gradient band */}
        <div style={{
          background:'linear-gradient(135deg, rgba(247,184,1,0.08) 0%, rgba(99,102,241,0.05) 100%)',
          borderBottom:'1px solid var(--border-main)',
          padding:'40px 40px 36px',
          display:'flex', alignItems:'center', gap:28
        }}>
          {/* Large avatar */}
          <div style={{
            width:80, height:80, borderRadius:'50%',
            background:'linear-gradient(135deg, var(--accent), #b8860b)',
            display:'grid', placeItems:'center',
            fontSize:'1.8rem', fontWeight:700, color:'#3d348b',
            border:'3px solid rgba(247,184,1,0.4)',
            boxShadow:'0 8px 24px rgba(247,184,1,0.2)',
            flexShrink:0
          }}>
            {initials}
          </div>

          <div style={{ flex:1 }}>
            <h2 style={{ marginBottom:8, fontSize:'1.8rem' }}>
              {student.firstName} {student.lastName}
            </h2>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <span style={{
                display:'inline-flex', alignItems:'center', gap:6,
                background:'var(--accent-soft)', border:'1px solid rgba(247,184,1,0.25)',
                padding:'5px 14px', borderRadius:8,
                color:'var(--accent)', fontSize:'0.82rem', fontWeight:700
              }}>
                <Building2 size={14} /> {student.department}
              </span>
              <span style={{
                display:'inline-flex', alignItems:'center', gap:6,
                background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)',
                padding:'5px 14px', borderRadius:8,
                color:'#f7b801', fontSize:'0.82rem', fontWeight:700
              }}>
                Active Student
              </span>
            </div>
          </div>

          {/* Action buttons in hero */}
          <div style={{ display:'flex', gap:10, flexShrink:0 }}>
            <Link to={`/students/edit/${student.id}`} className="btn btn-primary">
              <Pencil size={15} /> Edit
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="btn btn-secondary"
              style={{ color:'var(--danger)', borderColor:'rgba(255,107,107,0.25)',
                       background:'rgba(255,107,107,0.06)' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <motion.div
          variants={containerVariants}
          style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, padding:28 }}
        >
          <InfoBlock icon={<Mail size={13} />}    label="Email Address"  value={student.email} />
          <InfoBlock icon={<Phone size={13} />}   label="Phone Number"   value={student.phone} />
          <InfoBlock icon={<User size={13} />}    label="Age"
            value={student.age ? `${student.age} years old` : null} />
          <InfoBlock icon={<Calendar size={13} />} label="Registered On"
            value={new Date(student.createdAt).toLocaleDateString('en-US', { dateStyle:'long' })} />
          <div style={{ gridColumn:'1 / -1' }}>
            <InfoBlock icon={<MapPin size={13} />} label="Full Address" value={student.address} />
          </div>
        </motion.div>
      </motion.div>

      {showDelete && (
        <ConfirmModal
          title="Remove Student"
          message={`Are you sure you want to remove ${student.firstName} ${student.lastName}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </motion.div>
  );
}


