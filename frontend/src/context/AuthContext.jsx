import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Helpers ──────────────────────────────────────────────────────────────────

const setAxiosToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

const safeParseUser = () => {
    try {
        const raw = localStorage.getItem('user');
        if (!raw || raw === 'undefined' || raw === 'null') return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const persistSession = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// ── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Rehydrate session on mount / token change
    useEffect(() => {
        if (token) {
            setAxiosToken(token);
            const savedUser = safeParseUser();
            if (savedUser) {
                setUser(savedUser);
            } else {
                // Token exists but no user data → clear to be safe
                clearSession();
                setToken(null);
            }
        } else {
            setAxiosToken(null);
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    // ── Login ───────────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
            const { access_token, user: userData } = res.data;

            setAxiosToken(access_token);
            setToken(access_token);
            setUser(userData);
            persistSession(access_token, userData);

            toast.success(`Welcome back, ${userData?.full_name?.split(' ')[0] || 'Teacher'}!`);
            return true;
        } catch (err) {
            const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
            toast.error(msg);
            return false;
        }
    }, []);

    // ── Signup ──────────────────────────────────────────────────────────────
    const signup = useCallback(async (userData) => {
        try {
            await axios.post(`${API_BASE}/api/auth/signup`, userData);
            toast.success('Account created! Please sign in to continue.');
            return true;
        } catch (err) {
            const msg = err.response?.data?.detail || 'Signup failed. Please try again.';
            toast.error(msg);
            return false;
        }
    }, []);

    // ── Google Login ────────────────────────────────────────────────────────
    const googleLogin = useCallback(async (googleData) => {
        try {
            const res = await axios.post(`${API_BASE}/api/auth/google`, googleData);
            const { access_token, user: userData } = res.data;

            setAxiosToken(access_token);
            setToken(access_token);
            setUser(userData);
            persistSession(access_token, userData);

            toast.success(`Welcome, ${userData?.full_name?.split(' ')[0] || 'Teacher'}!`);
            return true;
        } catch (err) {
            toast.error('Google sign-in failed. Please try again.');
            return false;
        }
    }, []);

    // ── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        setAxiosToken(null);
        setToken(null);
        setUser(null);
        clearSession();
        toast.success("You've been signed out.");
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, googleLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};