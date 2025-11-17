import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',  
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para ver requests (DEBUG)
api.interceptors.request.use(
    (config) => {
        console.log('🔵 API Request:', config.method.toUpperCase(), config.url);
        return config;
    }
);

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response || error);
        return Promise.reject(error);
    }
);

export default api;