# Expense Tracker

A full-stack web application for personal expense management with user authentication, category-based tracking, and dashboard summaries.

---

## Problem Statement

Managing personal finances is challenging without a dedicated tool. Users need a simple, secure way to track daily expenses, categorize spending, and view summaries to make better financial decisions.

## Solution Overview

Expense Tracker provides a web-based platform where users can:
- Register and securely log in
- Add, edit, and delete expenses
- Categorize expenses (Food, Travel, Shopping, etc.)
- View dashboard summaries with total spending and category breakdowns

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JWT, bcrypt |
| Testing | Postman |
| Version Control | Git, GitHub |
| Deployment | Vercel (Frontend), Render/Railway (Backend) |

---

## System Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────┐
│                 │       │                 │       │              │
│  React Frontend │──────▶│  Express Backend │──────▶│    MySQL     │
│  (Vite, Axios)  │ HTTP  │  (REST API)     │ SQL   │   Database   │
│  Port: 5173     │◀──────│  Port: 5000     │◀──────│              │
│                 │       │                 │       │              │
└─────────────────┘       └─────────────────┘       └──────────────┘
```

**Authentication Flow:**
1. User registers/logs in → Backend returns JWT token
2. Token stored in localStorage
3. All subsequent API requests include token in Authorization header
4. Backend middleware validates token before processing requests

---

## Features

1. User Registration & Login (JWT-based authentication)
2. Add Expenses (amount, description, date, category)
3. Edit/Delete Expenses
4. Category-wise Expense Tracking
5. Monthly Expense Dashboard with summary cards
6. Expense Summary Reports (total, by category, monthly)

---

## Database Design

### ER Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │    expenses      │       │  categories  │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │◀──┐   │ id (PK)          │   ┌──▶│ id (PK)      │
│ name         │   └───│ user_id (FK)     │   │   │ category_name│
│ email        │       │ category_id (FK) │───┘   │ created_at   │
│ password     │       │ amount           │       └──────────────┘
│ created_at   │       │ description      │
│ updated_at   │       │ expense_date     │
└──────────────┘       │ created_at       │
                       │ updated_at       │
                       └──────────────────┘
```

### Tables

**Users Table**
| Field | Type | Constraints |
|-------|------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

**Categories Table**
| Field | Type | Constraints |
|-------|------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| category_name | VARCHAR(100) | NOT NULL, UNIQUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Expenses Table**
| Field | Type | Constraints |
|-------|------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| amount | DECIMAL(10,2) | NOT NULL |
| description | VARCHAR(255) | NOT NULL |
| expense_date | DATE | NOT NULL |
| category_id | INT | FK → categories(id) |
| user_id | INT | FK → users(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication APIs

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses:**
- `201` - User registered successfully
- `400` - Validation error / Email already exists
- `500` - Server error

#### POST /api/auth/login
Login and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Responses:**
- `200` - Returns `{ token: "jwt_token_here" }`
- `400` - Invalid credentials
- `500` - Server error

---

### Expense APIs (Protected - Requires Bearer Token)

#### GET /api/expenses
Get all expenses for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200` - Array of expense objects with category names

#### POST /api/expenses
Create a new expense.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 150.00,
  "description": "Groceries",
  "expense_date": "2025-01-15",
  "category_id": 1
}
```

**Response:** `201` - Expense added successfully

#### PUT /api/expenses/:id
Update an existing expense.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 200.00,
  "description": "Updated groceries",
  "expense_date": "2025-01-15",
  "category_id": 1
}
```

**Response:** `200` - Expense updated successfully

#### DELETE /api/expenses/:id
Delete an expense.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200` - Expense deleted successfully

---

### Category APIs

#### GET /api/categories
Get all categories.

**Response:** `200` - Array of category objects

#### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "category_name": "Healthcare"
}
```

**Response:** `201` - Category created successfully

---

## Team Responsibilities

| Member | Module | Deliverables |
|--------|--------|-------------|
| Member 1 | Authentication | Login, Registration, JWT Auth |
| Member 2 | Expense Management | CRUD operations for expenses |
| Member 3 | Category Management | Category listing and creation |
| Member 4 | Dashboard & Reports | Summary cards, expense display |
| Member 5 | DB, Testing, Docs, Deployment | Schema, API testing, documentation |

---

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Run schema and seed files
source database/schema.sql;
source database/seed.sql;
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your MySQL credentials

# Start development server
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| CORS_ORIGIN | Frontend URL for CORS | http://localhost:5173 |
| JWT_SECRET | Secret key for JWT tokens | my_secret_key_123 |
| DB_HOST | MySQL host | 127.0.0.1 |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | password |
| DB_NAME | MySQL database name | expense_tracker |

---

## Testing

### API Testing with Postman

All APIs have been tested using Postman. Import the collection from `testing/postman_collection.json`.

**Test Cases:**

| # | API | Method | Test Case | Expected Result |
|---|-----|--------|-----------|-----------------|
| 1 | /api/auth/register | POST | Valid registration | 201 - Success |
| 2 | /api/auth/register | POST | Duplicate email | 400 - Email exists |
| 3 | /api/auth/register | POST | Missing fields | 400 - Validation error |
| 4 | /api/auth/login | POST | Valid credentials | 200 - Token returned |
| 5 | /api/auth/login | POST | Wrong password | 400 - Invalid credentials |
| 6 | /api/expenses | GET | With valid token | 200 - Expense list |
| 7 | /api/expenses | GET | Without token | 401 - Unauthorized |
| 8 | /api/expenses | POST | Valid expense data | 201 - Created |
| 9 | /api/expenses | POST | Missing fields | 400 - Validation error |
| 10 | /api/expenses/:id | PUT | Valid update | 200 - Updated |
| 11 | /api/expenses/:id | DELETE | Valid delete | 200 - Deleted |
| 12 | /api/categories | GET | Fetch categories | 200 - Category list |
| 13 | /api/categories | POST | Create category | 201 - Created |

---

## Deployment Guide

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `node server.js`
7. Add environment variables (PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, CORS_ORIGIN)
8. Deploy

### Database (Remote MySQL)

Use a cloud MySQL provider:
- [Railway](https://railway.app) - Free tier available
- [PlanetScale](https://planetscale.com) - Free tier available
- [Aiven](https://aiven.io) - Free tier available

Update backend environment variables with remote DB credentials after setup.

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js   # Register/Login logic
│   │   ├── categoryController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── expenseRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Category.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Default categories
├── testing/
│   └── postman_collection.json
└── README.md
```

---

## License

This project is developed as an academic project for educational purposes.
