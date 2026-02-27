import { useState, useEffect } from 'react';
import { UserPlus, Filter, Download, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getStudents, deleteStudent } from '../services/api';
import toast from 'react-hot-toast';
import StudentTable from '../components/StudentTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

export default function StudentList() {
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const [hasMore, setHasMore]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchStudents(); }, [searchTerm, page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents(page, 10, searchTerm);
      setStudents(res.data.students);
      setTotal(res.data.total);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      toast.loading('Preparing PDF…', { id: 'export' });
      const res = await getStudents(1, 100, searchTerm);
      const all = res.data.students;
      if (!all?.length) { toast.error('No data found', { id: 'export' }); return; }

      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(212, 175, 55);
      doc.text('Student Directory', 14, 22);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(130, 155, 181);
      doc.text(`${all.length} records · Generated ${new Date().toLocaleDateString()}`, 14, 30);

      autoTable(doc, {
        startY: 38,
        head: [['Name', 'Email', 'Phone', 'Age', 'Department', 'Address']],
        body: all.map(s => [
          `${s.firstName} ${s.lastName}`, s.email,
          s.phone, s.age, s.department, s.address || 'N/A'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [17, 24, 39], textColor: [212, 175, 55], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [30, 40, 60] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      doc.save('students_list.pdf');
      toast.success('PDF exported!', { id: 'export' });
    } catch (err) {
      toast.error(`Export failed: ${err.message}`, { id: 'export' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(deleteTarget.id);
      toast.success('Student removed');
      setDeleteTarget(null);
      fetchStudents();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.35 }}
    >
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2 style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
            <Users size={26} style={{ color:'var(--accent)' }} />
            Students Directory
          </h2>
          <p>
            {total > 0
              ? `${total} student${total !== 1 ? 's' : ''} registered`
              : 'Manage and monitor your student records'}
          </p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export PDF
          </button>
          <Link to="/students/add" className="btn btn-primary">
            <UserPlus size={16} /> Add Student
          </Link>
        </div>
      </div>

      {/* ── Search / Filter bar ── */}
      <div className="card" style={{ marginBottom:24, padding:'18px 24px' }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <SearchBar
            value={searchTerm}
            onChange={val => { setSearchTerm(val); setPage(1); }}
          />
          <button className="icon-btn" title="Filters">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      {loading && students.length === 0 ? (
        <LoadingSpinner />
      ) : students.length > 0 ? (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <StudentTable students={students} onDelete={setDeleteTarget} />
          <Pagination
            page={page}
            total={total}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={<UserPlus size={48} />}
          title="No Students Found"
          message={searchTerm
            ? `No results for "${searchTerm}"`
            : "You haven't added any students yet."}
          actionLabel={searchTerm ? 'Clear Search' : 'Add Student'}
          actionTo={searchTerm ? null : '/students/add'}
          onAction={searchTerm ? () => setSearchTerm('') : null}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Remove Student"
          message={`Are you sure you want to remove ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </motion.div>
  );
}