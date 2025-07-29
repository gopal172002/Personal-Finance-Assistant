import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const login = (email, password) =>
    axiosInstance.post('/auth/login', { email, password });

export const register = (email, password) =>
    axiosInstance.post('/auth/register', { email, password });

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/transactions/upload', formData);
};

export const fetchTransactions = (page = 1, limit = 10, startDate, endDate) => {
    let url = `/transactions?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
    if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
    return axiosInstance.get(url);
};

export const fetchSummary = () => axiosInstance.get('/transactions/summary'); 