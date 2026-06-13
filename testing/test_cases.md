# API Testing Report - Expense Tracker

## Test Environment
- Tool: Postman
- Backend URL: http://localhost:5000/api
- Date: June 2025

---

## Test Cases & Results

### 1. Authentication Module

| # | Test Case | Method | Endpoint | Input | Expected Status | Result |
|---|-----------|--------|----------|-------|-----------------|--------|
| 1 | Register with valid data | POST | /api/auth/register | name, email, password | 201 | ✅ PASS |
| 2 | Register with duplicate email | POST | /api/auth/register | existing email | 400 | ✅ PASS |
| 3 | Register with missing fields | POST | /api/auth/register | only email | 400 | ✅ PASS |
| 4 | Login with valid credentials | POST | /api/auth/login | email, password | 200 + token | ✅ PASS |
| 5 | Login with wrong password | POST | /api/auth/login | wrong password | 400 | ✅ PASS |
| 6 | Login with non-existent email | POST | /api/auth/login | unknown email | 400 | ✅ PASS |

### 2. Expense Module

| # | Test Case | Method | Endpoint | Input | Expected Status | Result |
|---|-----------|--------|----------|-------|-----------------|--------|
| 7 | Get expenses (authenticated) | GET | /api/expenses | Bearer token | 200 | ✅ PASS |
| 8 | Get expenses (no token) | GET | /api/expenses | No auth header | 401 | ✅ PASS |
| 9 | Create expense (valid) | POST | /api/expenses | All fields + token | 201 | ✅ PASS |
| 10 | Create expense (missing fields) | POST | /api/expenses | Partial data | 400 | ✅ PASS |
| 11 | Update expense | PUT | /api/expenses/:id | Updated fields + token | 200 | ✅ PASS |
| 12 | Update expense (not owned) | PUT | /api/expenses/:id | Other user's expense | 404 | ✅ PASS |
| 13 | Delete expense | DELETE | /api/expenses/:id | Valid ID + token | 200 | ✅ PASS |
| 14 | Delete expense (not owned) | DELETE | /api/expenses/:id | Other user's expense | 404 | ✅ PASS |

### 3. Category Module

| # | Test Case | Method | Endpoint | Input | Expected Status | Result |
|---|-----------|--------|----------|-------|-----------------|--------|
| 15 | Get all categories | GET | /api/categories | - | 200 | ✅ PASS |
| 16 | Create category (valid) | POST | /api/categories | category_name | 201 | ✅ PASS |
| 17 | Create duplicate category | POST | /api/categories | existing name | 400 | ✅ PASS |

---

## Summary

- Total Test Cases: 17
- Passed: 17
- Failed: 0
- Pass Rate: 100%

## Notes
- All protected routes correctly return 401 when no token is provided
- User isolation is working - users cannot access other users' expenses
- Input validation is properly implemented on all endpoints
- JWT tokens expire after 24 hours as configured
