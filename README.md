# 🎓 Student Management System

A production-ready full-stack CRUD application for managing students.

**Tech Stack:** React (Vite) · FastAPI · MongoDB · CSS

---

## 📁 Project Structure

```
Advorix_Intern/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── database.py          # MongoDB connection
│   │   ├── models/student.py    # Pydantic models
│   │   ├── schemas/student.py   # Request/response schemas
│   │   ├── controllers/         # Business logic (CRUD)
│   │   └── routes/              # API endpoints
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page-level components
│   │   ├── services/api.js      # Axios API layer
│   │   ├── App.jsx              # Router setup
│   │   ├── main.jsx             # React entry
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **MongoDB** running on `localhost:27017`

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### 3. Seed Demo Data

Once both servers are running, seed the database:

- Click the **🌱 Seed Demo Data** button in the sidebar, **or**
- Send a POST request:

```bash
curl -X POST http://localhost:8000/seed-data
```

---

## 📡 API Endpoints

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/`                 | Health check                       |
| GET    | `/students`         | List students (paginated, searchable) |
| GET    | `/students/{id}`    | Get single student                 |
| POST   | `/students`         | Create student                     |
| PUT    | `/students/{id}`    | Update student                     |
| DELETE | `/students/{id}`    | Delete student                     |
| POST   | `/seed-data`        | Seed from DummyJSON API            |
| GET    | `/stats`            | Dashboard statistics               |

### Query Parameters (GET /students)

| Param      | Type   | Default | Description          |
|------------|--------|---------|----------------------|
| page       | int    | 1       | Page number          |
| limit      | int    | 10      | Items per page       |
| search     | string | —       | Search term          |
| department | string | —       | Filter by department |

---

## 📋 Student Schema

```json
{
  "id": "ObjectId string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "age": "integer",
  "phone": "string",
  "department": "string",
  "address": "string",
  "createdAt": "ISO datetime"
}
```

**Departments:** Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Mathematics, Physics, Chemistry, Biology, Business Administration, Economics

---

## ✨ Features

- ✅ Full CRUD (Create, Read, Update, Delete)
- ✅ Search & Pagination
- ✅ Dashboard with stats & department breakdown
- ✅ Form validation (email, age, phone)
- ✅ Toast notifications
- ✅ Delete confirmation modals
- ✅ Loading spinners & empty states
- ✅ Responsive mobile layout
- ✅ Dark theme with glassmorphism
- ✅ Data seeded from [DummyJSON](https://dummyjson.com/users)

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=student_management
```

---


