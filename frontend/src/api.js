import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// Request interceptor - for debugging
API.interceptors.request.use((config) => {
//     console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data);
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
});

// Response interceptor - for debugging
// API.interceptors.response.use(
//     (response) => {
//         console.log(`API Response: ${response.status}`, response.data);
//         return response;
//     },
//     (error) => {
//         console.error("API Error:", error.response?.status, error.response?.data);
//         return Promise.reject(error);
//     }
// );

export const fetchExpenses = () => API.get('/expenses'); 
export const createExpense = (expenseData) => API.post('/expenses', expenseData);
export const updateExpense = (id, expenseData) => API.put(`/expenses/${id}`, expenseData);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const fetchCategories = () => API.get('/categories').catch(() => ({
    data: [
        { id: 1, category_name: 'Food' },
        { id: 2, category_name: 'Travel' },
        { id: 3, category_name: 'Shopping' },
        { id: 4, category_name: 'Entertainment' },
        { id: 5, category_name: 'Education' },
        { id: 6, category_name: 'Miscellaneous' }
    ]
}));