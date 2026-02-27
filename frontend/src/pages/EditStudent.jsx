import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStudentById, updateStudent } from '../services/api';
import toast from 'react-hot-toast';
import StudentForm from '../components/StudentForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getStudentById(id);
        setStudent(res.data);
      } catch {
        toast.error('Failed to load student');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await updateStudent(id, formData);
      toast.success('Student updated!');
      navigate(`/students/view/${id}`);
    } catch {
      toast.error('Failed to update student');
    }
  };

  if (loading) return <LoadingSpinner />;

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
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {/* Avatar */}
          <div className="avatar" style={{ width:52, height:52, fontSize:'1.1rem', flexShrink:0 }}>
            {student ? `${student.firstName[0]}${student.lastName[0]}`.toUpperCase() : '??'}
          </div>
          <div>
            <h2 style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <Pencil size={20} style={{ color:'var(--accent)' }} />
              Edit Student Profile
            </h2>
            <p>
              Updating record for{' '}
              <strong style={{ color:'var(--text-main)' }}>
                {student?.firstName} {student?.lastName}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Last updated notice */}
      {student?.createdAt && (
        <div style={{
          background:'var(--accent-soft)',
          border:'1px solid rgba(247,184,1,0.2)',
          borderRadius:10,
          padding:'10px 18px',
          marginBottom:24,
          fontSize:'0.82rem',
          color:'var(--accent)',
          display:'flex', alignItems:'center', gap:8
        }}>
          <Pencil size={14} />
          Originally registered on{' '}
          {new Date(student.createdAt).toLocaleDateString('en-US', { dateStyle:'long' })}
        </div>
      )}

      <StudentForm
        initialData={student}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </motion.div>
  );
}
