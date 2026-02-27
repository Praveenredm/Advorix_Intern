import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import ViewStudent from './pages/ViewStudent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

export default function App() {
    const { token, loading } = useAuth();

    if (loading) return <LoadingSpinner />;

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={token ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
                path="/signup"
                element={token ? <Navigate to="/" replace /> : <Signup />}
            />

            {/* Protected routes */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Dashboard />} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/add" element={<AddStudent />} />
                <Route path="/students/edit/:id" element={<EditStudent />} />
                <Route path="/students/view/:id" element={<ViewStudent />} />
                {/* Legacy path support */}
                <Route path="/students/:id" element={<ViewStudent />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}