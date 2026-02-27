import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Students ──────────────────────────────────────────────

export const getStudents = (page = 1, limit = 10, search = '', department = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    if (department) params.department = department;
    return api.get('/students', { params });
};

export const getStudentById = (id) => {
    return api.get(`/students/${id}`);
};

export const createStudent = (data) => {
    return api.post('/students', data);
};

export const updateStudent = (id, data) => {
    return api.put(`/students/${id}`, data);
};

export const deleteStudent = (id) => {
    return api.delete(`/students/${id}`);
};

// ── Seed & Stats ──────────────────────────────────────────

export const seedData = () => {
    return api.post('/seed-data');
};

export const getStats = () => {
    return api.get('/stats');
};

export default api;
